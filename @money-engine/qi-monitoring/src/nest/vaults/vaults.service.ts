import { Injectable } from '@nestjs/common';
import { VaultDataResult, VaultsResult, SortType } from '../app/app.definitions';
import { MoreThan } from 'typeorm';
import { QiVault, QiVaultData } from '../../entity';
import { dataSource } from '../../data-source'

@Injectable()
export class VaultsService {

  constructor() {}

  async getAllVaults(
    pageSize: number,
    pageNumber: number
  ): Promise<VaultsResult> {

    const collateralCount = await dataSource.manager.count(QiVault);
    const totalNumberOfPages = Math.ceil(collateralCount / pageSize);

    return {
      vaults: await dataSource.manager.find(QiVault, {
        take: pageSize,
        skip: pageNumber * pageSize
      }),
      pageCount: totalNumberOfPages
    }  
  }

  async getVaultData(
    params: GetVaultDataParams
  ): Promise<VaultDataResult> {

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

    const vaultData = await dataSource.manager.find(QiVaultData, {
      where: {
        vault: { id: params.vaultId },
        collateralRatio: MoreThan(1)
      },
      order: orderObject,
      skip: params.pageSize * params.pageNumber,
      take: params.pageSize,
      relations: ['vault']
    })

    const vault = await dataSource.manager.findOne(QiVault, params.vaultId);

    const resultCount = await dataSource.manager.count(QiVaultData, {
      where: {
        vault: { id: params.vaultId } 
      }, 
      relations: ['vault']
    });

    return {
      pageCount: Math.ceil(params.pageSize / resultCount),
      vault,
      vaultData
    }
  }
}

export interface GetVaultDataParams {
  vaultId: number
  sortType: SortType
  pageSize: number
  pageNumber: number
}