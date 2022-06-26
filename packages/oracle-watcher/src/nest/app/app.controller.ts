import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { AppService } from "./app.service";
import {
  ORACLE_WATCHER_CREATE_DELTA_ALERT,
  ORACLE_WATCHER_REGISTER_ASSET,
  ORACLE_WATCHER_REGISTER_PRICE_SOURCE,
  ORACLE_WATCHER_UPDATE_DELTA_ALERT,
  IS_ORACLE_WATCHER_INITIALIZED,
  ORACLE_WATCHER_UPDATE_PRICE_SOURCE
} from "@money-engine/common";
import { DeltaService } from '../delta'
import { UpdatePriceSourceRequest } from '../../../../common-nest/src/nest/oracle-watcher-integration/dtos/UpdatePriceSourceRequest.dto';
import { 
  CreateAssetRequest,
  CreateAssetResponse,
  CreateDeltaRequest, 
  RegisterPricesourceRequest, 
  RegisterPricesourceResponse, 
  UpdateDeltaRequest ,
  IsOracleWatcherInitializeResponse
} from '@money-engine/common-nest';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly deltaService: DeltaService
  ) {}

  @MessagePattern(ORACLE_WATCHER_REGISTER_ASSET)
  async registerAsset(
    createAssetDto: CreateAssetRequest[]
  ): Promise<CreateAssetResponse[]> {
    return await this.appService.registerAsset(createAssetDto);
  }

  @MessagePattern(ORACLE_WATCHER_REGISTER_PRICE_SOURCE)
  async registerPriceSource(
    registerPriceSourceDto: RegisterPricesourceRequest[]
  ): Promise<RegisterPricesourceResponse[]> {
    return this.appService.registerPriceSource(registerPriceSourceDto);
  }

  @MessagePattern(ORACLE_WATCHER_UPDATE_PRICE_SOURCE)
  async updatePriceSource(updatePriceSourceRequest: UpdatePriceSourceRequest) {
    return this.appService.updatePriceSource(updatePriceSourceRequest);
  }

  @MessagePattern(ORACLE_WATCHER_CREATE_DELTA_ALERT)
  async createDeltaAlert(createDeltaAlertRequest: CreateDeltaRequest): Promise<string> {
    return this.deltaService.create(createDeltaAlertRequest)
  }

  @MessagePattern(ORACLE_WATCHER_UPDATE_DELTA_ALERT)
  async updateDataAlert(updateDeltaAlertRequest: UpdateDeltaRequest) {
    return this.deltaService.update(updateDeltaAlertRequest);
  }

  @MessagePattern(IS_ORACLE_WATCHER_INITIALIZED)
  isOracleWatcherInitialized(): IsOracleWatcherInitializeResponse {
    return {
      isInitialized: true
    }
  }

}
