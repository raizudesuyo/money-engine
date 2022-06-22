import { Inject, Injectable } from '@nestjs/common';
import { QiVaultData } from '../../entity';
import { dataSource } from '../../data-source'
import { MoreThan } from 'typeorm';
import { SortType } from '../app/RestApi.definitions';
import { QiVaultDataOnlyResponse } from '../../dtos'
import { QI_VAULT_DATA_REPOSITORY, TQiVaultDataRepository } from '../database';

@Injectable()
export class VaultDataService {

  constructor(
    @Inject(QI_VAULT_DATA_REPOSITORY) private readonly vaultDataRepository: TQiVaultDataRepository
  ) {}
  
  async getVaultData(
      params: GetVaultDataParams
  ): Promise<QiVaultDataOnlyResponse> {

    let orderObject;
    
    switch (params.sortType) {
      case 'debtRatio':
      orderObject = {
        collateralRatio: 'ASC'
      }
      break;
      default:
      orderObject = {
        id: 'ASC'
      }
      break;
    }

    const [vaultData, resultCount] = await this.vaultDataRepository.findAndCount({
      where: {
        collateralRatio: MoreThan(1)
      },
      order: orderObject,
      skip: params.pageSize * params.pageNumber,
      take: params.pageSize
    })

    return {
      pageCount: Math.ceil(resultCount / params.pageSize),
      vaultData: vaultData.map((v) => ({
        uuid: v.uuid,
        vaultNumber: v.vaultNumber,
        collateralAmount: v.collateralAmount,
        collateralRatio: v.collateralRatio,
        maiDebt: v.maiDebt,
        owner: v.owner,
        totalCollateralValue: v.totalCollateralValue,
        vaultId: v.vaultUuid
      }))
    }
  }
}

export interface GetVaultDataParams {
    sortType: SortType
    pageSize: number
    pageNumber: number
}

