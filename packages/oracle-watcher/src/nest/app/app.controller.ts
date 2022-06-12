import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { AppService } from "./app.service";
import {
  ORACLE_WATCHER_CREATE_DELTA_ALERT,
  ORACLE_WATCHER_REGISTER_ASSET,
  ORACLE_WATCHER_REGISTER_PRICE_SOURCE,
  ORACLE_WATCHER_UPDATE_DELTA_ALERT,
} from "@money-engine/common";
import { AssetService, CreateAssetRequestDto } from "../asset";
import { CreateAssetResponseDto } from "../asset/asset.service";
import { CreateDeltaRequestDto, DeltaService } from '../delta';
import { UpdateDeltaRequestDto } from '../delta/delta.service';
import {
  RegisterPricesourceRequestDto,
  RegisterPricesourceResponseDto,
} from "../pricesource";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly deltaService: DeltaService
  ) {}

  @MessagePattern(ORACLE_WATCHER_REGISTER_ASSET)
  async registerAsset(
    createAssetDto: CreateAssetRequestDto[]
  ): Promise<CreateAssetResponseDto[]> {
    return this.appService.registerAsset(createAssetDto);
  }

  @MessagePattern(ORACLE_WATCHER_REGISTER_PRICE_SOURCE)
  async registerPriceSource(
    registerPriceSourceDto: RegisterPricesourceRequestDto[]
  ): Promise<RegisterPricesourceResponseDto[]> {
    return this.appService.registerPriceSource(registerPriceSourceDto);
  }

  @MessagePattern(ORACLE_WATCHER_CREATE_DELTA_ALERT)
  async createDeltaAlert(createDeltaAlertRequest: CreateDeltaRequestDto): Promise<string> {
    return this.deltaService.create(createDeltaAlertRequest)
  }

  @MessagePattern(ORACLE_WATCHER_UPDATE_DELTA_ALERT)
  async updateDataAlert(updateDeltaAlertRequest: UpdateDeltaRequestDto) {
    return this.deltaService.update(updateDeltaAlertRequest);
  }
}
