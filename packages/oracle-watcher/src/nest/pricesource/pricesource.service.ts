import { BigNumberMath, OracleType, ORACLE_WATCHER_PRICE_UPDATED, PriceSourceAdapterFactory, UpdatePriceEvent2, Web3Chain, Web3HttpFactory } from '@money-engine/common';
import { MONEY_ENGINE, RegisterPricesourceRequest } from '@money-engine/common-nest';
import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { ClientProxy } from '@nestjs/microservices';
import { SchedulerRegistry } from '@nestjs/schedule';
import { BigNumber } from 'ethers';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { Repository } from 'typeorm';
import { AssetPriceDataUpdatedEvent, PRICE_UPDATED } from '../../constants/events';
import { Asset, AssetPriceSource, AssetPriceSourcePollJob } from '../../entity';
import { AssetPriceData } from '../../entity/AssetPriceData.entity';
import { ASSET_PRICE_DATA_REPOSITORY, ASSET_REPOSITORY, PRICE_SOURCE_ORACLE_REPOSITORY, PRICE_SOURCE_POLL_JOB_REPOSITORY } from '../database';

@Injectable()
export class PricesourceService implements OnApplicationBootstrap {
  constructor(
    @Inject(PRICE_SOURCE_ORACLE_REPOSITORY) private readonly priceSourceRepository: Repository<AssetPriceSource>,
    @Inject(PRICE_SOURCE_POLL_JOB_REPOSITORY) private readonly priceSourcePollJobRepository: Repository<AssetPriceSourcePollJob>,
    @Inject(ASSET_PRICE_DATA_REPOSITORY) private readonly assetPriceDataRepository: Repository<AssetPriceData>,
    @Inject(ASSET_REPOSITORY) private readonly assetRepository: Repository<Asset>,
    @InjectPinoLogger(PricesourceService.name) private readonly logger: PinoLogger,
    @Inject(MONEY_ENGINE) private readonly client: ClientProxy,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly eventEmitter: EventEmitter2,
  ) { 

  }

  async onApplicationBootstrap(): Promise<void> {
    this.reloadPollJobs();
  }

  async create(registerPricesourceRequestDto: RegisterPricesourceRequest) {
    // if asset exists, continue, else throw an error
    const asset = await this.assetRepository.findOne({ 
      where: { deleteFlag: false, uuid: registerPricesourceRequestDto.assetId },
    })
    if(!asset) throw new Error("Asset ID not found, Create Asset first");

    const priceSource = new AssetPriceSource(); //Now only supports oracles
    priceSource.oracleAddress = registerPricesourceRequestDto.oracleAddress;
    priceSource.oracleType = registerPricesourceRequestDto.oracleType;
    priceSource.asset = Promise.resolve(asset);

    await this.priceSourceRepository.insert(priceSource);

    this.addPollJob(priceSource);

    return priceSource.uuid;
  }

  async findAll(assetId?: string) {
    if(!!assetId) return this.priceSourceRepository.find({where: {asset: { uuid: assetId, deleteFlag: false }}})
    return this.priceSourceRepository.find();
  }

  async findByAddress(address: string) {
    return this.priceSourceRepository.findOne({
      where: {
        deleteFlag: false,
        oracleAddress: address
      }
    })
  }

  async remove(uuid: string) {
    const toBeRemoved = await this.priceSourceRepository.findOne({where: { uuid }})
    toBeRemoved.deleteFlag = true;
    await this.priceSourceRepository.save(toBeRemoved);
  }

  private async reloadPollJobs() {
    const pollJobs = await this.priceSourcePollJobRepository.find({
      relations: {
        priceSource: {
          asset: true
        }
      }
    })
    pollJobs.forEach(pollJob => {
      this.startPollJob(pollJob);
    });
  }

  private async addPollJob(priceSource: AssetPriceSource) {
    const newPollJob = new AssetPriceSourcePollJob();
    newPollJob.priceSource = priceSource;
    await this.priceSourcePollJobRepository.save(newPollJob);
    this.logger.info(`Added Poll Job ${newPollJob.uuid}`);
    this.reloadPollJobs();
  }

  private startPollJob(pollJob: AssetPriceSourcePollJob) {
    // TODO: Convert to Bull Queue using add { JobOpts: repeat: every 500 }
    const callback = async () => {
      const start = process.hrtime.bigint();
      // Create adapters,
      const asset = await pollJob.priceSource.asset;
      const web3HttpProvider = Web3HttpFactory.getProvider(asset.chain as Web3Chain);
      const priceSourceAdapter = PriceSourceAdapterFactory.getProvider({
        contractAddress: pollJob.priceSource.oracleAddress,
        contractProvider: web3HttpProvider,
        contractType: pollJob.priceSource.oracleType as OracleType
      })

      // Get latest price from oracle
      const oraclePrice = priceSourceAdapter.latestRoundData().catch((err) => {
        this.logger.error("Error on Asset: %s Chain: %s OracleAddress %s \nerr: %s",
          asset.name, asset.chain, pollJob.priceSource.oracleAddress, err)
      });

      const lastPriceDb = this.assetPriceDataRepository.findOne({ 
        where: { 
          deleteFlag: false, 
          oracle: { uuid: pollJob.priceSource.uuid }
        },
        order: {
          timestamp: {
            createdAt: 'DESC'
          }
        }
      })

      const actualOraclePrice = await oraclePrice;
      if(!actualOraclePrice) return;
      const actualLastPrice = await lastPriceDb;
      // if that price and this price were different, then emit price.updated event
      
      if(actualOraclePrice.answer.toString() != actualLastPrice?.price) {

        const asset = await pollJob.priceSource.asset;

        const newAssetPriceData = new AssetPriceData({
          asset,
          oracle: Promise.resolve(pollJob.priceSource),
          price: actualOraclePrice.answer.toString()
        });

        await this.assetPriceDataRepository.insert(newAssetPriceData);

        const priceUpdateData: AssetPriceDataUpdatedEvent = {
          assetUuid: asset.uuid,
          newPrice: actualOraclePrice.answer,
          delta: BigNumberMath.GetDelta(actualOraclePrice.answer, BigNumber.from(actualLastPrice?.price)),
          oldPrice: BigNumber.from(actualLastPrice?.price),
          priceSourceUuid: pollJob.priceSource.uuid
        }

        this.eventEmitter.emit(PRICE_UPDATED, priceUpdateData)
        const end = process.hrtime.bigint();

        this.logger.info(`Price Changed: Asset: ${newAssetPriceData.asset.name} Chain: ${newAssetPriceData.asset.chain} Last Price: ${actualLastPrice?.price} New Price: ${actualOraclePrice.answer.toString()} Process Time: ${end - start}`)
      }
    }

    try { this.schedulerRegistry.deleteInterval(pollJob.uuid); } catch(err) {}
    this.logger.info('Creating interval %s', pollJob.priceSource.uuid)
    const interval = setInterval(callback, 500)
    this.schedulerRegistry.addInterval(pollJob.uuid, interval)
  }

  @OnEvent(PRICE_UPDATED)
  async onPriceUpdated(newPrice: AssetPriceDataUpdatedEvent) {
    this.client.emit<void, UpdatePriceEvent2>(ORACLE_WATCHER_PRICE_UPDATED, {
      assetUuid: newPrice.assetUuid,
      price: newPrice.newPrice,
      priceDelta: newPrice.delta,
      priceSourceUuid: newPrice.priceSourceUuid
    })
  }
}
