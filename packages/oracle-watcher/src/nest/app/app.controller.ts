import { Controller, Get, Put, Post } from "@nestjs/common";
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
  CreateDeltaRequest, 
  RegisterPricesourceRequest, 
  RegisterPricesourceResponse, 
  UpdateDeltaRequest ,
  IsOracleWatcherInitializeResponse
} from '@money-engine/common-nest';
import { Body } from "@nestjs/common/decorators";


@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly deltaService: DeltaService
  ) {}

  @Post('/price-source')
  @MessagePattern(ORACLE_WATCHER_REGISTER_PRICE_SOURCE)
  async registerPriceSource(
    @Body() registerPriceSourceDto: RegisterPricesourceRequest[]
  ): Promise<RegisterPricesourceResponse[]> {
    return this.appService.registerPriceSource(registerPriceSourceDto);
  }

  @Put('/price-source')
  @MessagePattern(ORACLE_WATCHER_UPDATE_PRICE_SOURCE)
  async updatePriceSource(
    @Body() updatePriceSourceRequest: UpdatePriceSourceRequest[]
  ) {
    return this.appService.updatePriceSource(updatePriceSourceRequest);
  }

  @Post('/delta-alert')
  @MessagePattern(ORACLE_WATCHER_CREATE_DELTA_ALERT)
  async createDeltaAlert(
    @Body() createDeltaAlertRequest: CreateDeltaRequest
  ): Promise<string> {
    return this.deltaService.create(createDeltaAlertRequest)
  }

  @Put('/delta-alert')
  @MessagePattern(ORACLE_WATCHER_UPDATE_DELTA_ALERT)
  async updateDataAlert(
    @Body() updateDeltaAlertRequest: UpdateDeltaRequest
  ) {
    return this.deltaService.update(updateDeltaAlertRequest);
  }

  @Get('/')
  @MessagePattern(IS_ORACLE_WATCHER_INITIALIZED)
  isOracleWatcherInitialized(): IsOracleWatcherInitializeResponse {
    return {
      isInitialized: true
    }
  }
}
