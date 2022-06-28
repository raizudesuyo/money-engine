import { IMaiVaultContractData, IQiDaoVaultContractAdapter, IQiDaoVaultData, QiDaoVaultContractAdapterFactory, QiDaoVaultService, Web3Chain, Web3HttpFactory } from '@money-engine/common';
import { Processor, Process, InjectQueue } from '@nestjs/bull';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { QiVault } from '../../entity';
import { QI_VAULT_DATA_REPOSITORY, TQiVaultDataRepository } from '../database';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ALL_VAULT_DATA_SYNCED } from '../../constants/events';
import { BigNumber, utils } from 'ethers'

@Injectable()
@Processor('qi-reload')
export class QiReloadConsumer {

  constructor(
    @InjectPinoLogger(QiReloadConsumer.name) private readonly logger: PinoLogger,
    @Inject(QI_VAULT_DATA_REPOSITORY) private readonly vaultDataRepository: TQiVaultDataRepository,

    @InjectQueue('qi-reload') private readonly reloadQueue: Queue<TGetVaultData>,
    private readonly eventEmitter: EventEmitter2
  ) {

  }

  @Process({
    concurrency: 12
  })
  async getVaultData(job: Job<TGetVaultData>) {

    const { data: { contract, vaultNumber, vault }} = job
    const { vaultName, vaultChain, tokenSymbol } = vault;

    const [vaultService] = this.getVaultService(contract);

    // If things doesn't exist, just log and return
    if(!vaultService) {
      this.logger.error('not supported')
      return
    }

    this.logger.info(`Syncing ${contract.name} # ${vaultNumber}`);
    const vaultUserData: IQiDaoVaultData | null = await vaultService
      .getVaultUserData(vaultNumber)
      .catch((e) => {
        this.logger.error(e);

        return null;
      });

    if (!!vaultUserData) {
      const { collateralAmount, collateralRatio, maiDebt, owner, collateralTotalAmount } = vaultUserData; 
      const safeCollateralRatio = collateralRatio.lt(1000)
      ? vaultUserData.collateralRatio.toNumber()
      : 1000;

      this.vaultDataRepository.updateVaultData({
        collateralAmount: collateralAmount.toString(),
        collateralRatio: safeCollateralRatio, 
        maiDebt: maiDebt.toString(),
        owner,
        totalCollateralValue: collateralTotalAmount.toString(),
        vaultNumber,
        vault
      });

      this.logger.info({
        'event': 'Vault Data Synced',
        vaultNumber,
        vaultName,
        vaultChain,
        owner,
        collateralAmount: `${utils.commify(utils.formatUnits(collateralAmount))} ${tokenSymbol}`,
        collateralTotalAmount: `$${utils.commify(utils.formatUnits(collateralTotalAmount))}`,
        maiDebt: `$${utils.commify(utils.formatUnits(maiDebt))}`,
        collateralRatio: safeCollateralRatio,
      });

      // If all vault data got, then emit an event that it is so
      const waiting = await this.reloadQueue.getWaitingCount();
      const active = await this.reloadQueue.getActiveCount();

      if(waiting + active == 0) {
        this.logger.info('Event; All vault data synced')
        this.eventEmitter.emit(ALL_VAULT_DATA_SYNCED)
      }
    }    
  }

  private getVaultService(contract: IMaiVaultContractData): [QiDaoVaultService?] {
    const web3Provider = Web3HttpFactory.getProvider(
      contract.chain as Web3Chain
    );

    if (!web3Provider) {
      return [undefined];
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