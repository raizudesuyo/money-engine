import { Injectable } from '@nestjs/common';
import { AssetService, CreateAssetRequestDto, CreateAssetResponseDto } from '../asset';
import { RegisterPricesourceRequestDto, RegisterPricesourceResponseDto, PricesourceService } from '../pricesource';

@Injectable()
export class AppService {

  constructor(
    private readonly assetService: AssetService,
    private readonly priceSourceService: PricesourceService
  ) {}

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
