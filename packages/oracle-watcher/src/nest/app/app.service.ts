import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { AssetService, CreateAssetRequestDto, CreateAssetResponseDto } from '../asset';
import { RegisterPricesourceRequestDto, RegisterPricesourceResponseDto, PricesourceService } from '../pricesource';
import { ClientProxy } from '@nestjs/microservices';
import { MONEY_ENGINE } from '../money-engine';
import { ORACLE_WATCHER_INITIALIZED } from '@money-engine/common';

@Injectable()
export class AppService implements OnApplicationBootstrap {

  constructor(
    private readonly assetService: AssetService,
    private readonly priceSourceService: PricesourceService,
    @Inject(MONEY_ENGINE) private client: ClientProxy,
  ) {}

  async onApplicationBootstrap() {
      this.client.connect();
      this.client.emit(ORACLE_WATCHER_INITIALIZED, {})
  }

  async registerAsset(
    registerAssetDto: CreateAssetRequestDto[]
  ): Promise<CreateAssetResponseDto[]> 
  {
    const assetWithUuid = registerAssetDto.map(async (assetDto) => {
      const existingAsset = await this.assetService.findByAddress(assetDto.address, assetDto.chain);
      const uuid = !!existingAsset ? existingAsset.uuid : await this.assetService.create(assetDto);

      return {
        uuid: uuid,
        ...assetDto
      }
    })

    return Promise.all(assetWithUuid).then((asset) => asset.map((asset) => ({ ...asset })))
  }

  async registerPriceSource(
    registerPriceSourceDto: RegisterPricesourceRequestDto[]
  ): Promise<RegisterPricesourceResponseDto[]> {
    const priceSourceWithUuid = registerPriceSourceDto.map(async (priceSourceDto) => {
      const existingPriceSource = await this.priceSourceService.findByAddress(priceSourceDto.oracleAddress)
      const uuid = !!existingPriceSource ? existingPriceSource.uuid : await this.priceSourceService.create(priceSourceDto);

      return {
        uuid,
        ...priceSourceDto
      }
    })

    return Promise.all(priceSourceWithUuid).then((priceSource) => priceSource.map((priceSource) => ({ ...priceSource })))
  }
}
