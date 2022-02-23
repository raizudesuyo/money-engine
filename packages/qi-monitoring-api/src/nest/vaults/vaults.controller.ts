import { Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { VaultsService } from './vaults.service';
import { VaultsResult, SortType, VaultDataResult } from '../app/app.definitions';

@Controller('/vaults')
export class VaultsController {
  constructor(private readonly vaultsService: VaultsService) {}

  @Get('')
  async getVaults(
    @Query('pageSize', new DefaultValuePipe(100), ParseIntPipe) pageSize: number,
    @Query('pageNumber', new DefaultValuePipe(0), ParseIntPipe) pageNumber: number
  ): Promise<VaultsResult> {

    return await this.vaultsService.getAllVaults(
      pageSize,
      pageNumber
    )
  }

  @Get(':vaultId')
  async getVaultData(
    @Query('pageSize', new DefaultValuePipe(100), ParseIntPipe) pageSize: number,
    @Query('pageNumber', new DefaultValuePipe(0), ParseIntPipe) pageNumber: number,
    @Query('sortType', new DefaultValuePipe('debtRatio')) sortType: SortType, // we will just assume we got it correctly somehow for now
    @Param('vaultId', ParseIntPipe) vaultId: number     
  ): Promise<VaultDataResult> {

    return await this.vaultsService.getVaultData({
        pageSize,
        pageNumber,
        sortType,
        vaultId
      }
    )
  }
}
