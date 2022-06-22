import { Web3Provider } from '@ethersproject/providers';
import { IMaiVaultContractData, IQiDaoVaultContractAdapter, IQiDaoVaultData, QiDaoVaultContractAdapterFactory, QiDaoVaultService, Web3Chain, Web3HttpFactory } from '@money-engine/common';
import { Processor, Process } from '@nestjs/bull';
import { Inject, Injectable } from '@nestjs/common';
import { Job } from 'bull';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { QiVault } from 'src/entity';
import { QI_VAULT_DATA_REPOSITORY, QI_VAULT_REPOSITORY, TQiVaultDataRepository, TQiVaultRepository } from '../database';

@Injectable()
@Processor('qi-reload')
export class QiReloadConsumer {

  constructor(
    @InjectPinoLogger(QiReloadConsumer.name) private readonly logger: PinoLogger,
    @Inject(QI_VAULT_DATA_REPOSITORY) private readonly vaultDataRepository: TQiVaultDataRepository
  ) {

  }

  @Process({
    concurrency: 4
  })
  async getVaultData(job: Job<TGetVaultData>) {

    const { data: { contract, vaultNumber, vault } } = job

    const [vaultService] = this.getStuff(contract);

    // If things doesn't exist, just log and return
    if(!vaultService) {
      this.logger.error('not supported')
      return
    }

    this.logger.info(`Syncing ${contract.name} # ${vaultNumber}`);
    const vaultUserData: IQiDaoVaultData = await vaultService
      .getVaultUserData(vaultNumber)
      .catch((e) => {
        this.logger.error(e);

        return null;
      });

    this.logger.info(`synced ${JSON.stringify(vaultUserData)}`);
    if (vaultUserData) {
      this.vaultDataRepository.updateVaultUserData({
        collateralAmount: vaultUserData.collateralAmount.toString(),
        collateralRatio: vaultUserData.collateralRatio.lt(1000)
          ? vaultUserData.collateralRatio.toNumber()
          : 1000,
        maiDebt: vaultUserData.maiDebt.toString(),
        owner: vaultUserData.owner,
        totalCollateralValue: vaultUserData.collateralTotalAmount.toString(),
        vaultNumber,
        vault
      });
    }
  }

  private getStuff(contract: IMaiVaultContractData): [QiDaoVaultService] {
    const web3Provider = Web3HttpFactory.getProvider(
      contract.chain as Web3Chain
    );

    if (!web3Provider) {
      return;
    }

    const vaultAdapter = QiDaoVaultContractAdapterFactory.getProvider({
      contractAddress: contract.address,
      contractProvider: web3Provider,
      contractType: contract.type,
    });

    const vaultService = new QiDaoVaultService(vaultAdapter);

    return [vaultService]
  }
}

export type TGetVaultData = {
  vault: QiVault,
  vaultNumber: number,
  contract: IMaiVaultContractData
}