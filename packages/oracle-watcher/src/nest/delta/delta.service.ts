import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ASSET_DELTA_ALERT_REPOSITORY, ASSET_PRICE_DATA_REPOSITORY, ASSET_REPOSITORY } from '../database';
import { Asset, AssetPriceData, AssetDeltaAlert } from '../../entity';
import { Repository } from 'typeorm';
import { OnEvent } from '@nestjs/event-emitter';
import { BigNumber } from 'ethers';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { ClientProxy } from '@nestjs/microservices';
import { DeltaAlertEvent, ORACLE_WATCHER_DELTA_ALERT } from '@money-engine/common'
import { CreateDeltaRequest, MONEY_ENGINE, UpdateDeltaRequest } from '@money-engine/common-nest';
import { AssetPriceDataUpdatedEvent, PRICE_UPDATED } from '../../constants/events';
import { BigNumberMath } from '../../../../common/src/helpers/BigNumberMath';

@Injectable()
export class DeltaService implements OnApplicationBootstrap {

  constructor(
    @Inject(ASSET_PRICE_DATA_REPOSITORY) private readonly assetPriceDataRepository: Repository<AssetPriceData>,
    @Inject(ASSET_REPOSITORY) private readonly assetRepository: Repository<Asset>,
    @Inject(ASSET_DELTA_ALERT_REPOSITORY) private readonly assetDeltaAlertRepository: Repository<AssetDeltaAlert>,
    @InjectPinoLogger(DeltaService.name) private readonly logger: PinoLogger,
    @Inject(MONEY_ENGINE) private readonly client: ClientProxy,
  ) {

  }

  async onApplicationBootstrap() {
    await this.client.connect()
      .catch((err) => console.error(err))
  }

  async create(createDeltaDto: CreateDeltaRequest) {
    // Creates a delta alert setting up initial references
    const asset = await this.assetRepository.findOne({ 
      where: { deleteFlag: false, uuid: createDeltaDto.assetId },
    })
    if(!asset) throw new Error("Asset ID not found, Create Asset first");

    const newDelta = new AssetDeltaAlert();
    newDelta.asset = Promise.resolve(asset);
    newDelta.delta = createDeltaDto.delta;

    // setup reference price to whatever the current price we have one
    newDelta.referencePrice = await this.assetPriceDataRepository.findOne({
      where: {
        asset: {
          uuid: asset.uuid,
          deleteFlag: false,
        },
        deleteFlag: false,
      },
      order: {
        timestamp: { 
          createdAt: 'DESC'
        }
      }
    });

    await this.assetDeltaAlertRepository.insert(newDelta);

    return newDelta.uuid;
  }

  async update(updateDeltaDto: UpdateDeltaRequest) {
    await this.assetDeltaAlertRepository.update(
      { 
        uuid: updateDeltaDto.deltaId,
        deleteFlag: false 
      }, 
      { 
        delta: updateDeltaDto.delta 
      }
    );
  }

  // Receive events, 
  @OnEvent(PRICE_UPDATED, { async: true })
  async handlePriceUpdatedEvent(payload: AssetPriceDataUpdatedEvent) {
    // if delta is met, then alert
    // Get asset deltas
    const deltas = (await this.assetRepository.findOne({
      where: {
        uuid: payload.assetUuid,
        deleteFlag: false,
      },
    }))?.deltaAlerts;
    // Get reference prices
    
    deltas.forEach(delta => {
      const newPrice = payload.newPrice;
      const reference = BigNumber.from(delta.referencePrice.price);

      const [,actualDelta] = BigNumberMath.GetDelta(newPrice, reference);

      //TODO: Need to know if actually works
      if(Math.abs(actualDelta.toNumber()) >= Math.abs(delta.delta)) {
        this.logger.info(`Sending Delta Event ${delta.uuid} to money-engine queue`)
        this.client.emit<void, DeltaAlertEvent>(ORACLE_WATCHER_DELTA_ALERT, {
          deltaId: delta.uuid,
          previousPrice: reference,
          newPrice: newPrice,
          priceDelta: actualDelta.toNumber()
        })
      }
    });
  }
}