import { OracleType, UpdatePriceEvent2 } from '@money-engine/common';
import { CreateAssetRequest, MONEY_ENGINE, OracleWatcherIntegrationService, RegisterPricesourceRequest } from '@money-engine/common-nest';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Cron } from '@nestjs/schedule';
import { head } from 'lodash';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { CAN_START_SYNC_ORACLE } from '../../constants/global-configs';
import { GLOBAL_STATE_REPOSITORY, QI_VAULT_DATA_REPOSITORY, QI_VAULT_REPOSITORY, TGlobalStateRepository, TQiVaultDataRepository, TQiVaultRepository } from '../database';

@Injectable()
export class OracleWatcherService extends OracleWatcherIntegrationService {
  constructor(
    @Inject(MONEY_ENGINE) private readonly client: ClientProxy,
    @InjectPinoLogger(OracleWatcherService.name) private readonly logger: PinoLogger,
    @Inject(QI_VAULT_REPOSITORY) private readonly vaultRepository: TQiVaultRepository,
    @Inject(QI_VAULT_DATA_REPOSITORY) private readonly vaultDataRepository: TQiVaultDataRepository,
    @Inject(GLOBAL_STATE_REPOSITORY) private readonly globalStateRepository: TGlobalStateRepository
  ) {
    super(client);
  }

  async registerAssets() {
    const vaults = await this.vaultRepository.find();
    const assets: CreateAssetRequest[] = vaults.map((vault) => ({
      name: vault.tokenSymbol,
      address: vault.tokenAddress,
      chain: vault.vaultChain,
    }))

    this.logger.info(`Registering Assets: ${JSON.stringify(assets)}`)
    const assetsWithId = await this.registerAssetsToOracleWatcher(assets);
    this.logger.info(`Assets Registered: ${JSON.stringify(assetsWithId)}`)

    assetsWithId.forEach((assetResponse) => {
      const vault = head(vaults.filter((vault => vault.tokenAddress === assetResponse.address)))
      vault.oracleWatcherIntegration.assetUuid = assetResponse.uuid;

      this.logger.info(`Asset ${vault.tokenSymbol} assigned AssetUuid: ${assetResponse.uuid}`)
    })

    await this.vaultRepository.save(vaults)
  }

  async registerPriceSources() {
    const vaults = await this.vaultRepository.find();
    const priceSourceRequest: RegisterPricesourceRequest[] = vaults.map((vault) => ({
      assetId: vault.oracleWatcherIntegration.assetUuid,
      oracleAddress: vault.priceOracleAddress,
      oracleType: vault.oracleType as OracleType
    }))

    this.logger.info(`Registering PriceSources: ${JSON.stringify(priceSourceRequest)}`)

    const priceSourceResponse = await this.registerPriceSourceToOracleWatcher(priceSourceRequest).catch((err) => this.logger.error(err))
    if(!priceSourceResponse) return;
    priceSourceResponse.forEach((priceSourceResponse) => {
      const vault = head(vaults.filter((vault => vault.priceOracleAddress === priceSourceResponse.oracleAddress)))
      vault.oracleWatcherIntegration.priceSourceUuid = priceSourceResponse.uuid;

      this.logger.info(`Asset PriceSource ${vault.tokenSymbol} assigned AssetUuid: ${priceSourceResponse.uuid}`)
    })

    await this.vaultRepository.save(vaults);
  }

  async canStartRegister(): Promise<boolean> {
    return !!(await this.globalStateRepository.findByConfigName(CAN_START_SYNC_ORACLE))
  }

  async onAllVaultDataSynced() {
    this.logger.info('Setting CAN_START_SYNC_ORACLE')
    await this.globalStateRepository.setConfigBoolean(CAN_START_SYNC_ORACLE, true);
  }

  // Register Data Alerts
  @Cron('*/5 * * * *')
  async registerDataAlerts() {
    // For all vaults, get vault data with lowest deltas
    this.logger.info('Resending Deltas')
  }

  async onOracleWatcherPriceUpdated(payload: UpdatePriceEvent2) {
    this.logger.info('Payload Received %s', JSON.stringify(payload))
  }
}
