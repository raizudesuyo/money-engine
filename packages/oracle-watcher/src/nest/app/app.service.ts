import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MONEY_ENGINE } from '@money-engine/common-nest';
import { ORACLE_WATCHER_INITIALIZED } from '@money-engine/common';
import { AssetService } from '../asset';
import { PricesourceService } from '../pricesource';
import { CreateAssetRequest, CreateAssetResponse, RegisterPricesourceRequest, RegisterPricesourceResponse } from '@money-engine/common-nest';
import { UpdatePriceSourceRequest } from '../../../../common-nest/src/nest/oracle-watcher-integration/dtos/UpdatePriceSourceRequest.dto';

@Injectable()
export class AppService implements OnApplicationBootstrap {

  constructor(
    private readonly assetService: AssetService,
    private readonly priceSourceService: PricesourceService,
    @Inject(MONEY_ENGINE) private client: ClientProxy,
  ) {}

  async onApplicationBootstrap() {
    await this.client.connect();
    this.client.emit(ORACLE_WATCHER_INITIALIZED, {})
  }

  

  async registerPriceSource(
    registerPriceSourceDto: RegisterPricesourceRequest[]
  ): Promise<RegisterPricesourceResponse[]> {
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

  async updatePriceSource(updatePriceSourceRequest: UpdatePriceSourceRequest[]) {
    return this.priceSourceService.updatePollPriority(updatePriceSourceRequest);
  }
}
