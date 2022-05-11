import { Injectable } from '@nestjs/common';
import { SortType } from '../app/RestApi.definitions';
import { MoreThan } from 'typeorm';
import { QiVault, QiVaultData } from '../../entity';
import { dataSource } from '../../data-source'
import { QiVaultsOnlyResponse, QiVaultDataResponse } from '../../dtos'
import { BigNumber } from 'ethers';

@Injectable()
export class VaultsService {

  constructor() {}

  async getAllVaults(
    pageSize: number,
    pageNumber: number
  ): Promise<QiVaultsOnlyResponse> {

    const collateralCount = await dataSource.manager.count(QiVault);
    const totalNumberOfPages = Math.ceil(collateralCount / pageSize);
    const vaults = await dataSource.manager.find(QiVault, {
      take: pageSize,
      skip: pageNumber * pageSize
    });

    return {
      vaults: vaults.map((v) => ({
        id: v.id,
        chain: v.vaultChain,
        canPublicLiquidate: v.canPublicLiquidate,
        dollarValue: BigNumber.from(v.dollarValue),
        gainRatio: v.gainRatio,
        minimumRatio: v.minimumRatio,
        name: v.vaultName,
        priceOracleAddress: v.priceOracleAddress,
        tokenAddress: v.tokenAddress,
        tokenSymbol: v.tokenSymbol,
        vaultAddress: v.vaultAddress
      })),
      pageCount: totalNumberOfPages
    }  
  }

  async getVaultData(
    params: GetVaultDataParams
  ): Promise<QiVaultDataResponse> {

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

    const vault = await dataSource.manager.findOne(QiVault, {
      where: {
        id: params.vaultId
      }
    });

    const resultCount = await dataSource.manager.count(QiVaultData, {
      where: {
        vault: { id: params.vaultId } 
      }, 
      relations: ['vault']
    });

    // return mapped vaultData and vault
    return {
      pageCount: Math.ceil(params.pageSize / resultCount),
      vault: {
        id: vault.id,
        chain: vault.vaultChain,
        canPublicLiquidate: vault.canPublicLiquidate,
        dollarValue: BigNumber.from(vault.dollarValue),
        gainRatio: vault.gainRatio,
        minimumRatio: vault.minimumRatio,
        name: vault.vaultName,
        priceOracleAddress: vault.priceOracleAddress,
        tokenAddress: vault.tokenAddress,
        tokenSymbol: vault.tokenSymbol,
        vaultAddress: vault.vaultAddress
      },
      vaultData: vaultData.map((v) => ({
        id: v.vaultId,
        collateralAmount: BigNumber.from(v.collateralAmount),
        collateralRatio: v.collateralRatio,
        maiDebt: BigNumber.from(v.maiDebt),
        owner: v.owner,
        totalCollateralValue: BigNumber.from(v.totalCollateralValue),
    }))
    }
  }
}

export interface GetVaultDataParams {
  vaultId: number
  sortType: SortType
  pageSize: number
  pageNumber: number
}