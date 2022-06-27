import { IData, 
  IMaiVaultContractData, 
  IQiDaoSmartContractListener, 
  IQiDaoVaultData, 
  IQiDaoVaultService, 
  QiDaoSmartContractListenerFactory, 
  QiDaoVaultContractAdapterFactory, 
  QiDaoVaultService, 
  Web3Chain, 
  Web3HttpFactory, 
  Web3WebSocketFactory } from '@money-engine/common';
import { Inject, Injectable, 
  OnApplicationBootstrap } from '@nestjs/common';
import { BigNumber, ethers, providers } from 'ethers';
import { InjectPinoLogger, 
  PinoLogger } from 'nestjs-pino';
import { QiVaultData, QiVault } from '../../entity';
import { QI_VAULT_DATA_REPOSITORY, 
  QI_VAULT_REPOSITORY, 
  TQiVaultDataRepository, 
  TQiVaultRepository } from '../database';

@Injectable()
export class QiEventsListenerService implements OnApplicationBootstrap {
  constructor(
    @InjectPinoLogger(QiEventsListenerService.name) private readonly logger: PinoLogger,
    @Inject(QI_VAULT_REPOSITORY) private readonly vaultRepository: TQiVaultRepository,
    @Inject(QI_VAULT_DATA_REPOSITORY) private readonly vaultDataRepository: TQiVaultDataRepository

  ) {}

  async onApplicationBootstrap() {
    this.logger.info('Starting to Listen');
    const data = require('../../../config.json') as IData;
    this.listen(data);
  }

  private async listen(data: IData) {
    data.maiVaultContracts.forEach((vault) => {
      this.logger.info(`Listening to Events ${vault.name}`);

      let provider: providers.BaseProvider;
      const chain = vault.chain as Web3Chain;

      if(chain == 'polygon'){
          provider = Web3HttpFactory.getProvider(chain)
      } else {
          provider = Web3HttpFactory.getProvider(chain);
      }
  
      if(!provider) {
        this.logger.info(`Unssuported vault ${vault.chain}-${vault.name}`)
        return;
      }

      const vaultAdapter = QiDaoVaultContractAdapterFactory.getProvider({
          contractAddress: vault.address,
          contractProvider: provider,
          contractType: vault.type
      });
      const vaultListener = QiDaoSmartContractListenerFactory.getProvider({
          contractAddress: vault.address,
          contractProvider: provider,
          contractType: vault.type
      })
      const vaultService = new QiDaoVaultService(vaultAdapter);

      const params: ListenerParams = {
          vaultListener,
          vaultService,
          vault
      }

      this.listenToCreateVault(params);
      this.listenToCollateralDeposits(params);
      this.listenToCollateralWithdrawals(params);
      this.listenToTokenBorrows(params);
      this.listenToTokenRepayments(params);
      this.listenToVaultLiquidations(params);
    })
  }

  listenToCreateVault(params: ListenerParams) {
    const { vaultListener: contractListener, vault } = params;

    contractListener.onVaultCreated(async (id, ownerAddress) => {
      this.logger.info(`Vault ${vault.name} # ${id} Created by ${ownerAddress}`);

      const qiVault = await this.getQiVault(vault.address);

      this.vaultDataRepository.save(new QiVaultData({
        owner: ownerAddress,
        vaultNumber: id.toNumber(),
        vaultUuid: qiVault?.uuid,
        collateralRatio: 0,
        collateralAmount: '0',
        maiDebt: '0',
        totalCollateralValue: '0',
        isEmpty: true
      }))
    });
  }

  listenToCollateralDeposits (params: ListenerParams) {
    const { vaultListener: contractListener, vault, vaultService: contractGateway } = params;
    contractListener.onCollateralDeposited(async (id, amount) => {
      const logMessage = `Vault ${vault.name} # ${id} Deposited ${ethers.utils.commify(ethers.utils.formatEther(amount))}`

      const qiVault = await this.getQiVault(vault.address);
      const vaultData = await this.getQiVaultData(qiVault, id.toNumber());

      if (!vaultData) {
          this.logger.info(`${logMessage} but it hasn't been synced yet 😥`)
          return;
      } else {
          this.logger.info(logMessage);
      }

      // TODO: update algorithm to include latest dollar price of asset?
      const collateralAmount = BigNumber.from(vaultData.collateralAmount).add(amount);
      const collateralValue = await contractGateway.calculatePredictedVaultAmount(collateralAmount, BigNumber.from(qiVault?.dollarValue));
      
      let debtRatio = BigNumber.from(0);

      try {
        debtRatio = collateralValue.mul(100).div(BigNumber.from(vaultData.maiDebt).mul(100000000));
      } catch (E) {
        this.logger.error('Div by zero error, check maiDebt of ' + JSON.stringify(vaultData))
        this.logger.error(E);
      }

      vaultData.collateralAmount = collateralAmount.toString(),
      vaultData.collateralRatio = this.safeConvertBigNumberToNumber(debtRatio),
      vaultData.totalCollateralValue = collateralValue.toString(),

      this.vaultDataRepository.save(vaultData);
    });
  }

  listenToCollateralWithdrawals(params: ListenerParams) {
    const { vaultListener: contractListener, vault, vaultService: contractGateway } = params;

    contractListener.onCollateralWithdrawn(async (id, amount) => {
      const logMessage = `Vault ${vault.name} # ${id} Withdrawn ${ethers.utils.commify(ethers.utils.formatEther(amount))}`;

      const qiVault = await this.getQiVault(vault.address);
      const vaultData = await this.getQiVaultData(qiVault, id.toNumber());

      if (!vaultData) {
        this.logger.info(`${logMessage} but it hasn't been synced yet 😥`)
        return;
      } else {
        this.logger.info(logMessage);
      }

      // TODO: update algorithm to include latest dollar price of asset?
      const collateralAmount = BigNumber.from(vaultData.collateralAmount).sub(amount);
      const collateralValue = await contractGateway.calculatePredictedVaultAmount(collateralAmount, BigNumber.from(qiVault?.dollarValue));
      let debtRatio = BigNumber.from(0)

      try {
        debtRatio = collateralValue.mul(100).div(BigNumber.from(vaultData.maiDebt).mul(100000000));
      } catch (E) {
        this.logger.error('Div by zero error, check maiDebt of ' + JSON.stringify(vaultData))
        this.logger.error(E);
      }

      vaultData.collateralAmount = collateralAmount.toString(),
      vaultData.collateralRatio = this.safeConvertBigNumberToNumber(debtRatio),
      vaultData.totalCollateralValue = collateralValue.toString(),

      // Make a guess work for now, on deposit update predicted values,
      this.vaultDataRepository.save(vaultData);
    });
  }

  listenToTokenBorrows(params: ListenerParams) {
    const { vaultListener: contractListener, vault, vaultService: contractGateway } = params;

    contractListener.onTokenBorrow(async (id, amount) => {
      const logMessage = `Vault ${vault.name} # ${id} Withdrawn ${ethers.utils.commify(ethers.utils.formatEther(amount))}`;

      const qiVault = await this.getQiVault(vault.address);
      const vaultData = await this.getQiVaultData(qiVault, id.toNumber());

      if (!vaultData) {
        this.logger.info(`${logMessage} but it hasn't been synced yet 😥`)
        return;
      } else {
        this.logger.info(logMessage);
      }

      // TODO: update algorithm to include latest dollar price of asset?
      const newMaiDebt = BigNumber.from(vaultData.maiDebt).add(amount);
      let debtRatio = BigNumber.from(0)

      try {
        debtRatio = BigNumber.from(vaultData.collateralAmount).mul(100).div(BigNumber.from(newMaiDebt).mul(100000000));

      } catch (E) {
        this.logger.error('Div by zero error, check maiDebt of ' + JSON.stringify(vaultData))
        this.logger.error(E);
      }

      vaultData.collateralRatio = this.safeConvertBigNumberToNumber(debtRatio),
      vaultData.maiDebt = newMaiDebt.toString(),

      // Make a guess work for now, on deposit update predicted values,
      this.vaultDataRepository.save(vaultData);
    });
  }

  listenToTokenRepayments(params: ListenerParams) {
    const { vaultListener: contractListener, vault, vaultService: contractGateway } = params;

    contractListener.onTokenRepaid(async (id, amount, closingFee) => {
      const logMessage = `Vault ${vault.name} # ${id} Repayed ${ethers.utils.commify(ethers.utils.formatEther(amount))}`;

      const qiVault = await this.getQiVault(vault.address);

      if(qiVault === null) {
        // Handle it,
        return;
      }

      const vaultData = await this.getQiVaultData(qiVault, id.toNumber());

      if (!vaultData) {
        this.logger.info(`${logMessage} but it hasn't been synced yet 😥`)
        return;
      } else {
        this.logger.info(logMessage);
      }

      // TODO: update algorithm to include latest dollar price of asset?
      const newMaiDebt = BigNumber.from(vaultData.maiDebt).sub(amount);
      const collateralAmount = BigNumber.from(vaultData.collateralAmount).sub(BigNumber.from(closingFee));
      const collateralValue = await contractGateway.calculatePredictedVaultAmount(collateralAmount, BigNumber.from(qiVault.dollarValue));

      let debtRatio = BigNumber.from(0)

      try {
        debtRatio = collateralValue.mul(100).div(BigNumber.from(newMaiDebt).mul(100000000));
      } catch (E) {
        this.logger.error('Div by zero error, check maiDebt of ' + JSON.stringify(vaultData))
        this.logger.error(E);
      }

      // Make a guess work for now, on deposit update predicted values,
      vaultData.collateralRatio = this.safeConvertBigNumberToNumber(debtRatio),
      vaultData.totalCollateralValue = collateralValue.toString(),
      vaultData.collateralAmount = collateralAmount.toString(),
      vaultData.maiDebt = newMaiDebt.toString(),

      this.vaultDataRepository.save(vaultData);
    });
  }


  listenToVaultLiquidations(params: ListenerParams) {
    const { vaultListener: contractListener, vault, vaultService: contractGateway } = params;

    contractListener.onLiquidateVault(async (id, amount, buyer) => {
      const logMessage = `Vault ${vault.name} # ${id} Liquidated by ${buyer}`;

      const qiVault = await this.getQiVault(vault.address);
      const vaultUserData: IQiDaoVaultData | null = await contractGateway.getVaultUserData(id.toNumber()).catch(() => null);

      if (!vaultUserData) {
        this.logger.info(`${logMessage} but it hasn't been synced yet 😥`)
        return;
      } else {
        this.logger.info(logMessage);
      }

      if (vaultUserData) {
        this.vaultDataRepository.updateVaultData({
          collateralAmount: vaultUserData.collateralAmount.toString(),
          collateralRatio: vaultUserData.collateralRatio.lt(1000) ? vaultUserData.collateralRatio.toNumber() : 1000,
          maiDebt: vaultUserData.maiDebt.toString(),
          owner: vaultUserData.owner,
          totalCollateralValue: vaultUserData.collateralTotalAmount.toString(),
          vault: qiVault,
          vaultNumber: id.toNumber()
        })
      }
    });
  }

  private async getQiVault(vaultAddress: string) {
    const qiVault = await this.vaultRepository.findOne({ where: { vaultAddress: vaultAddress } });
    if(qiVault === null) throw new Error(`Null Qi Vault ${vaultAddress}`)
    return qiVault
  }

  private async getQiVaultData(vault: QiVault, vaultNumber: number) {
    // Gets vault data based from what vault it is and its id on chain (not the id, don't be mistaken, vaultId is based from the chain)
    return await this.vaultDataRepository.findOne({where: { vaultNumber: vaultNumber, vault: { uuid: vault.uuid } }, relations: ['vault'] });
  }

  private safeConvertBigNumberToNumber(n: BigNumber) {
    try {
        return n.toNumber();
    } catch (error) {
        return 0;
    }
  };
}



// Sets up listener for each, assume everything is a erc20QiStablecoin event, coz they mostly are
// Only update support for cross-chain vaults

interface ListenerParams {
    vaultListener: IQiDaoSmartContractListener,
    vault: IMaiVaultContractData,
    vaultService: IQiDaoVaultService
}