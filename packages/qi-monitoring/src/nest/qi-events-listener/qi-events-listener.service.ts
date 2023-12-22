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
import { AbstractProvider, ethers } from 'ethers';
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

      let provider: AbstractProvider;
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
        vaultNumber: Number(id),
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
      const logMessage = `Vault ${vault.name} # ${id} Deposited ${this.commify(ethers.formatEther(amount))}`

      const qiVault = await this.getQiVault(vault.address);
      const vaultData = await this.getQiVaultData(qiVault, Number(id));

      if (!vaultData) {
          this.logger.info(`${logMessage} but it hasn't been synced yet 😥`)
          return;
      } else {
          this.logger.info(logMessage);
      }

      // TODO: update algorithm to include latest dollar price of asset?
      const collateralAmount = BigInt(vaultData.collateralAmount) + amount;
      const collateralValue = await contractGateway.calculatePredictedVaultAmount(collateralAmount, BigInt(qiVault?.dollarValue));
      
      let debtRatio = BigInt(0);

      try {
        debtRatio = (collateralValue * BigInt(100)) / (BigInt(vaultData.maiDebt) * BigInt(100000000));
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
      const logMessage = `Vault ${vault.name} # ${id} Withdrawn ${this.commify(ethers.formatEther(amount))}`;

      const qiVault = await this.getQiVault(vault.address);
      const vaultData = await this.getQiVaultData(qiVault, Number(id));

      if (!vaultData) {
        this.logger.info(`${logMessage} but it hasn't been synced yet 😥`)
        return;
      } else {
        this.logger.info(logMessage);
      }

      // TODO: update algorithm to include latest dollar price of asset?
      const collateralAmount = BigInt(vaultData.collateralAmount) - amount;
      const collateralValue = await contractGateway.calculatePredictedVaultAmount(collateralAmount, BigInt(qiVault?.dollarValue));
      let debtRatio = BigInt(0)

      try {
        debtRatio = (collateralValue * BigInt(100)) / (BigInt(vaultData.maiDebt) * BigInt(100000000));
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
      const logMessage = `Vault ${vault.name} # ${id} Withdrawn ${this.commify(ethers.formatEther(amount))}`;

      const qiVault = await this.getQiVault(vault.address);
      const vaultData = await this.getQiVaultData(qiVault, Number(id));

      if (!vaultData) {
        this.logger.info(`${logMessage} but it hasn't been synced yet 😥`)
        return;
      } else {
        this.logger.info(logMessage);
      }

      // TODO: update algorithm to include latest dollar price of asset?
      const newMaiDebt = BigInt(vaultData.maiDebt) + amount;
      let debtRatio = BigInt(0)

      try {        
        debtRatio = (BigInt(vaultData.collateralAmount) * BigInt(100)) / newMaiDebt * BigInt(100000000);
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
      const logMessage = `Vault ${vault.name} # ${id} Repayed ${this.commify(ethers.formatEther(amount))}`;

      const qiVault = await this.getQiVault(vault.address);

      if(qiVault === null) {
        // Handle it,
        return;
      }

      const vaultData = await this.getQiVaultData(qiVault, Number(id));

      if (!vaultData) {
        this.logger.info(`${logMessage} but it hasn't been synced yet 😥`)
        return;
      } else {
        this.logger.info(logMessage);
      }

      // TODO: update algorithm to include latest dollar price of asset?
      const newMaiDebt = BigInt(vaultData.maiDebt) - (amount);
      const collateralAmount = BigInt(vaultData.collateralAmount) - closingFee;
      const collateralValue = await contractGateway.calculatePredictedVaultAmount(collateralAmount, BigInt(qiVault.dollarValue));

      let debtRatio = BigInt(0)

      try {
        debtRatio = (collateralValue * BigInt(100)) / (newMaiDebt) * BigInt(100000000);
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
      const vaultUserData: IQiDaoVaultData | null = await contractGateway.getVaultUserData(Number(id)).catch(() => null);

      if (!vaultUserData) {
        this.logger.info(`${logMessage} but it hasn't been synced yet 😥`)
        return;
      } else {
        this.logger.info(logMessage);
      }

      if (vaultUserData) {
        this.vaultDataRepository.updateVaultData({
          collateralAmount: vaultUserData.collateralAmount.toString(),
          collateralRatio: vaultUserData.collateralRatio > BigInt(1000) ? Number(vaultUserData.collateralRatio) : 1000,
          maiDebt: vaultUserData.maiDebt.toString(),
          owner: vaultUserData.owner,
          totalCollateralValue: vaultUserData.collateralTotalAmount.toString(),
          vault: qiVault,
          vaultNumber: Number(id)
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

  private safeConvertBigNumberToNumber(n: bigint) {
    try {
        return Number(n)
    } catch (error) {
        return 0;
    }
  };

  private commify(value: string) {
    const match = value.match(/^(-?)([0-9]*)(\.?)([0-9]*)$/);
    if (!match || (!match[2] && !match[4])) {
      throw new Error(`bad formatted number: ${ JSON.stringify(value) }`);
    }
  
    const neg = match[1];
    const whole = BigInt(match[2] || 0).toLocaleString("en-us");
    const frac = match[4] ? match[4].match(/^(.*?)0*$/)[1]: "0";
  
    return `${ neg }${ whole }.${ frac }`;
  }
}



// Sets up listener for each, assume everything is a erc20QiStablecoin event, coz they mostly are
// Only update support for cross-chain vaults

interface ListenerParams {
    vaultListener: IQiDaoSmartContractListener,
    vault: IMaiVaultContractData,
    vaultService: IQiDaoVaultService
}