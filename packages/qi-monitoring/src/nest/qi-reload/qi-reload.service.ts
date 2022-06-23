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

@Injectable()
export class QiReloadService implements OnApplicationBootstrap, OnModuleDestroy {

  constructor(
    @InjectPinoLogger(QiReloadService.name) private readonly logger: PinoLogger,
    @InjectQueue('qi-reload') private readonly reloadQueue: Queue<TGetVaultData>,
    @Inject(QI_VAULT_REPOSITORY) private readonly vaultRepository: TQiVaultRepository,
    @Inject(GLOBAL_STATE_REPOSITORY) private readonly globalStateRepository: TGlobalStateRepository
    
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

      const vault = await this.vaultRepository.updateVaultData({
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
      });

      const vaultCountN = vaultCount.toNumber();

      for (let vaultNumber = 0; vaultNumber < vaultCountN; vaultNumber++) {
        this.reloadQueue.add({
          vault,
          vaultNumber,
          contract
        })
      }

      this.globalStateRepository.setConfigBoolean('IS_SYNC_JOBS_CREATED', true)
    });
  }

  onModuleDestroy() {
    this.logger.info('Cleaning Queue')
    this.reloadQueue.clean(1000, 'wait');
    this.reloadQueue.clean(1000, 'active');  
    this.reloadQueue.clean(1000, 'paused');  
  }

}
