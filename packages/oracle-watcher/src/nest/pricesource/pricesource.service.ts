import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Asset, AssetPriceSource, AssetPriceSourcePollJob } from '../../entity';
import { PRICE_SOURCE_ORACLE_REPOSITORY, PRICE_SOURCE_POLL_JOB_REPOSITORY } from '../database';
import { Repository } from 'typeorm';
import { SchedulerRegistry } from '@nestjs/schedule';
import { PriceSourceAdapterFactory } from '../../../../common/src/adapters/oracles/PriceSourceAdapterFactory';
import { OracleType } from '../../../../common/src/constants/oracle-types';
import { Web3HttpFactory } from '../../../../common/src/providers/web3/Web3HttpFactory';
import { Web3Chain } from '../../../../common/src/providers/web3/Web3WebsocketFactory';
import { AssetPriceData } from '../../entity/AssetPriceData.entity';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { ASSET_PRICE_DATA_REPOSITORY, ASSET_REPOSITORY } from '../database/database.provider';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RegisterPricesourceRequest } from '@money-engine/common-nest';

@Injectable()
export class PricesourceService implements OnApplicationBootstrap {
  constructor(
    @Inject(PRICE_SOURCE_ORACLE_REPOSITORY) private readonly priceSourceRepository: Repository<AssetPriceSource>,
    @Inject(PRICE_SOURCE_POLL_JOB_REPOSITORY) private readonly priceSourcePollJobRepository: Repository<AssetPriceSourcePollJob>,
    @Inject(ASSET_PRICE_DATA_REPOSITORY) private readonly assetPriceDataRepository: Repository<AssetPriceData>,
    @Inject(ASSET_REPOSITORY) private readonly assetRepository: Repository<Asset>,
    @InjectPinoLogger(PricesourceService.name) private readonly logger: PinoLogger,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly eventEmitter: EventEmitter2
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
    const pollJobs = await this.priceSourcePollJobRepository.find()
    pollJobs.forEach(pollJob => {
      this.startPollJob(pollJob);
    });
  }

  private async addPollJob(priceSource: AssetPriceSource) {
    const newPollJob = new AssetPriceSourcePollJob();
    newPollJob.priceSource = priceSource;
    await this.priceSourcePollJobRepository.insert(newPollJob);
    this.logger.info(`Added Poll Job ${newPollJob.uuid}`);
    this.startPollJob(newPollJob);
  }

  private startPollJob(pollJob: AssetPriceSourcePollJob) {
    // TODO: Convert to Bull Queue using add { JobOpts: repeat: every 500 }
    const callback = async () => {
      const start = process.hrtime.bigint();
      // Create adapters,
      const assetChain = (await pollJob.priceSource.asset).chain as Web3Chain
      const web3HttpProvider = Web3HttpFactory.getProvider(assetChain);
      const priceSourceAdapter = PriceSourceAdapterFactory.getProvider({
        contractAddress: pollJob.priceSource.oracleAddress,
        contractProvider: web3HttpProvider,
        contractType: pollJob.priceSource.oracleType as OracleType
      })

      // Get latest price from oracle
      const oraclePrice = priceSourceAdapter.latestRoundData();
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
      
      const newAssetPriceData = new AssetPriceData();
      newAssetPriceData.asset = await pollJob.priceSource.asset;
      newAssetPriceData.oracle = Promise.resolve(pollJob.priceSource);
      newAssetPriceData.price = (await oraclePrice).answer.toString();
      await this.assetPriceDataRepository.insert(newAssetPriceData);

      // if that price and this price were different, then emit price.updated event
      if((await oraclePrice).answer.toString() !== (await lastPriceDb).price) {
        this.eventEmitter.emit('price.updated', newAssetPriceData)
      }

      const end = process.hrtime.bigint();

      // Getting price time is logged
      this.logger.info(`Price Data: ${newAssetPriceData.uuid} Time: ${end - start}`)
    }

    const interval = setInterval(callback, 500)
    this.schedulerRegistry.addInterval(pollJob.uuid, interval)
  }
}


