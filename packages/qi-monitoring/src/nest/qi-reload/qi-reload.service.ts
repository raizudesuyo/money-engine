import { IData, QiDaoVaultContractAdapterFactory, QiDaoVaultService, Web3Chain, Web3HttpFactory } from '@money-engine/common';
import { InjectQueue } from '@nestjs/bull';
import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Queue } from 'bull';
import { filter } from 'lodash';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { QI_VAULT_DATA_REPOSITORY, QI_VAULT_REPOSITORY, TQiVaultDataRepository, TQiVaultRepository } from '../database';
import { TGetVaultData } from './qi-reload.processor';

@Injectable()
export class QiReloadService implements OnApplicationBootstrap {

  constructor(
    @InjectPinoLogger(QiReloadService.name) private readonly logger: PinoLogger,
    @InjectQueue('qi-reload') private readonly reloadQueue: Queue<TGetVaultData>,
    @Inject(QI_VAULT_REPOSITORY) private readonly vaultRepository: TQiVaultRepository
  ) {

  }

  onApplicationBootstrap() {
    this.logger.info("Starting reload all data");
    const data = require("../config.json") as IData;

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
    });
  }

}
