import { Controller, Get, Put, Post, Param } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import {
  ORACLE_WATCHER_REGISTER_ASSET,
} from "@money-engine/common";
import { 
  AssetDTO,
  CreateAssetRequest,
  CreateAssetResponse,
} from '@money-engine/common-nest';
import { Body } from "@nestjs/common/decorators";
import { AssetService } from "./asset.service";
import { NotFoundException } from "@nestjs/common/exceptions";


@Controller('asset')
export class AssetController {
  constructor(
    private readonly assetService: AssetService,
  ) {}

  @Get()
  async getAssets(): Promise<AssetDTO[]> {
    return (await this.assetService.findAll()).map((asset) => ({
        uuid: asset.uuid,
        chain: asset.chain,
        name: asset.name,
        address: asset.address
    }))
  }

  @Get(':uuid')
  async getAsset(
    @Param() uuid: string
  ): Promise<AssetDTO>{
    const asset = await this.assetService.findOne(uuid)

    if(!asset) throw new NotFoundException()

    return {
        name: asset.name,
        address: asset.address,
        chain: asset.chain,
        uuid: asset.uuid,
    }
  }

  @Post()
  @MessagePattern(ORACLE_WATCHER_REGISTER_ASSET)
  async registerAsset(
    @Body() createAssetDto: CreateAssetRequest[]
  ): Promise<CreateAssetResponse[]> {
    return await this.assetService.registerAsset(createAssetDto);
  }
}
