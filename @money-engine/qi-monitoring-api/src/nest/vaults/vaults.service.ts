import { Injectable } from '@nestjs/common';
import { VaultDataResult, VaultsResult, SortType } from '../app/app.definitions';
import { MoreThan } from 'typeorm';
import { QiVault, QiVaultData } from 'qi-db';
import { getConnection } from 'typeorm'

@Injectable()
export class VaultsService {

  constructor() {}

  async getAllVaults(
    pageSize: number,
    pageNumber: number
  ): Promise<VaultsResult> {

    const collateralCount = await getConnection().manager.count(QiVault);
    const totalNumberOfPages = Math.ceil(collateralCount / pageSize);

    return {
      vaults: await getConnection().manager.find(QiVault, {
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

    const vaultData = await getConnection().manager.find(QiVaultData, {
      where: {
        vault: { id: params.vaultId },
        collateralRatio: MoreThan(1)
      },
      order: orderObject,
      skip: params.pageSize * params.pageNumber,
      take: params.pageSize,
      relations: ['vault']
    })

    const vault = await getConnection().manager.findOne(QiVault, params.vaultId);

    const resultCount = await getConnection().manager.count(QiVaultData, {
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