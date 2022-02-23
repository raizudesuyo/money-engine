import { Controller, DefaultValuePipe, Get, ParseIntPipe, Query } from '@nestjs/common';
import { SortType, VaultDataOnlyResult } from '../app/app.definitions';
import { VaultDataService } from './vault-data.service';

@Controller('/vault-data')
export class VaultDataController {
  constructor(private readonly vaultDataService: VaultDataService) {}

  @Get('')
  async getVaults(
    @Query('pageSize', new DefaultValuePipe(100), ParseIntPipe) pageSize: number,
    @Query('pageNumber', new DefaultValuePipe(0), ParseIntPipe) pageNumber: number,
    @Query('sortType', new DefaultValuePipe('debtRatio')) sortType: SortType
  ): Promise<VaultDataOnlyResult> {

    return await this.vaultDataService.getVaultData({
        pageNumber,
        pageSize,
        sortType
    })
  }
}
