import { IData, QiDaoVaultContractAdapterFactory, QiDaoVaultService, Web3Chain, Web3HttpFactory } from '@money-engine/common';
import { InjectQueue } from '@nestjs/bull';
import { Inject, Injectable, OnApplicationBootstrap, OnModuleDestroy } from '@nestjs/common';
import { Queue } from 'bull';
import { filter } from 'lodash';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { QI_VAULT_REPOSITORY, TQiVaultRepository } from '../database';
import { TGetVaultData } from './qi-reload.processor';
import { GLOBAL_STATE_REPOSITORY } from '../database/database.provider';
import { TGlobalStateRepository } from '../database/repositories/GlobalState.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ALL_VAULT_DATA_SYNCED } from '../../constants/events';
import _ = require('lodash');

@Injectable()
export class QiReloadService implements OnApplicationBootstrap {

  constructor(
    @InjectPinoLogger(QiReloadService.name) private readonly logger: PinoLogger,
    @InjectQueue('qi-reload') private readonly reloadQueue: Queue<TGetVaultData>,
    @Inject(QI_VAULT_REPOSITORY) private readonly vaultRepository: TQiVaultRepository,
    @Inject(GLOBAL_STATE_REPOSITORY) private readonly globalStateRepository: TGlobalStateRepository,
    private readonly eventEmitter: EventEmitter2
    
  ) {

  }

  async onApplicationBootstrap() {

    const isJobsCreated = (await this.globalStateRepository.findByConfigName('IS_SYNC_JOBS_CREATED')) === 'true'
    this.logger.info(`Is jobs created?: ${isJobsCreated}`)

    if(isJobsCreated) return;
    
    this.logger.info("Starting reload all data");
    const data = require("../../../config.json") as IData;

    const validContracts = filter(data.maiVaultContracts, (d) => !!d.type);

    // prints check collateral percentage for each
    validContracts.forEach(async (contract) => {
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

      const {
        dollarValue,
        gainRatio,
        minimumRatio,
        priceOracleAddress,
        stabilityPoolAddress,
        tokenAddress,
        vaultCount,
      } = await vaultService.getVault();

      const vault = await this.vaultRepository.updateVault({
        canPublicLiquidate: !!stabilityPoolAddress.match(
          "0x0000000000000000000000000000000000000000"
        ),
        dollarValue: dollarValue.toString(),
        gainRatio,
        minimumRatio,
        priceOracleAddress,
        tokenAddress,
        tokenSymbol: contract.name, // not actually accurate
        vaultName: contract.name,
        vaultAddress: contract.address,
        vaultChain: contract.chain,
        oracleType: contract.priceSourceType
      });

      const vaultCountN = vaultCount.toNumber();

      const allWaitingJobs = await this.reloadQueue.getWaiting()

      for (let vaultNumber = 0; vaultNumber < vaultCountN; vaultNumber++) {
        // If job doesn't exist yet, then add
        const jobAlreadyExist = _.find(allWaitingJobs, (job) => job.data.vault == vault && job.data.vaultNumber == vaultNumber);
        if(!jobAlreadyExist) {
          this.reloadQueue.add({
            vault,
            vaultNumber,
            contract
          })
        }
      }
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
