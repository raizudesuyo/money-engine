import { OracleType, ORACLE_WATCHER_UPDATE_PRICE_SOURCE, UpdatePriceEvent2 } from '@money-engine/common';
import { CreateAssetRequest, MONEY_ENGINE, OracleWatcherIntegrationService, RegisterPricesourceRequest, UpdatePriceSourceRequest } from '@money-engine/common-nest';
import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Cron } from '@nestjs/schedule';
import { head } from 'lodash';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { CAN_START_SYNC_ORACLE } from '../../constants/global-configs';
import { GLOBAL_STATE_REPOSITORY, QI_VAULT_DATA_REPOSITORY, QI_VAULT_REPOSITORY, TGlobalStateRepository, TQiVaultDataRepository, TQiVaultRepository } from '../database';
import { PollPriority, PollPriorityTime } from '../../../../common/src/constants/PollPriority';
import * as _ from 'lodash';
import { ignoreElements } from 'rxjs';

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
      oracleType: vault.oracleType as OracleType,
      pollPriority: PollPriority.MEDIUM,
      decimal: vault.decimal
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

    // Get vaults,
    const vaults = await this.vaultRepository.find({
      relations: {
        vaultData: true
      }, 
      where: {
        vaultData: {
          isEmpty: false
        }
      }
    });

    const requestDto: UpdatePriceSourceRequest[] = []

    vaults.forEach((vault) => {
      Promise.resolve((async () => {
        const { minimumRatio, uuid, oracleWatcherIntegration: { priceSourceUuid } } = vault;
        const vaultData = await vault.vaultData;
        const vaultDataClosestToLiquidation = _(vaultData)
          .filter((v) => v.collateralRatio > minimumRatio)
          .map((v) => v.collateralRatio - minimumRatio)
          .min()
        const pollPriority = PollPriorityTime.deltaToPriority(vaultDataClosestToLiquidation)
        requestDto.push({
          pollPriority,
          priceSourceUuid
        })
      })())
    })

    await this.client.connect();
    this.client.send<void, UpdatePriceSourceRequest[]>(ORACLE_WATCHER_UPDATE_PRICE_SOURCE, requestDto)
      .pipe(ignoreElements())
      .subscribe({
        error: (err) => this.logger.error(err),
        complete: () => this.logger.info({
          event: 'Updated Oracle Watcher Poll Priority',
          data: requestDto
        })
    })
  }

  @Cron('0 0 0 * *')
  async resyncEverything() {
    // Resync everything once a week maybe                                                                                                 
    this.logger.info('Starting resync everything job')
  }

  async recalculateMinimumLiquidationPrice() {
    // total collateral value = (dollar value * collateral amount) -> Needs to have same decimal amount
  }

  async onOracleWatcherPriceUpdated(payload: UpdatePriceEvent2) {
    this.logger.info({
      event: 'Price Update Received',
      ...payload
    })

    const asset = await this.vaultRepository.findOneBy({
      oracleWatcherIntegration: {
        assetUuid: payload.assetUuid
      }
    })

    if(!!asset) {
      asset.dollarValue = payload.price.toString();
      this.vaultRepository.update({uuid: asset.uuid}, asset);

      const { uuid, dollarValue, minimumRatio } = asset;

      // TODO: Check if can now liquidate
      const nearestTillLiquidation = await this.vaultDataRepository.findVaultDataNearestTillLiquidation({
        vaultUuid: uuid,
        vaultMinimumRatio: minimumRatio
      })

      const dollarValueBn = BigInt(dollarValue)

      // Calculate the whole thing
      // mai debt / dollar collateral value to liquidation 

      // TODO: Add Liquidation Event
      
    }
  }
}
