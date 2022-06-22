import { Inject, Injectable } from '@nestjs/common';
import { SortType } from '../app/RestApi.definitions';
import { MoreThan } from 'typeorm';
import { QiVault, QiVaultData } from '../../entity';
import { dataSource } from '../../data-source'
import { QiVaultsOnlyResponse, QiVaultDataResponse } from '../../dtos'
import { QI_VAULT_REPOSITORY, QI_VAULT_DATA_REPOSITORY, TQiVaultDataRepository, TQiVaultRepository } from '../database';

@Injectable()
export class VaultsService {

  constructor(
    @Inject(QI_VAULT_REPOSITORY) private readonly vaultRepository: TQiVaultRepository,
    @Inject(QI_VAULT_DATA_REPOSITORY) private readonly vaultDataRepository: TQiVaultDataRepository
  ) {}

  async getAllVaults(
    pageSize: number,
    pageNumber: number
  ): Promise<QiVaultsOnlyResponse> {

    const collateralCount = await dataSource.manager.count(QiVault);
    const totalNumberOfPages = Math.ceil(collateralCount / pageSize);
    const vaults = await this.vaultRepository.find({
      take: pageSize,
      skip: pageNumber * pageSize
    });

    return {
      vaults: vaults.map((v) => ({
        uuid: v.uuid,
        chain: v.vaultChain,
        canPublicLiquidate: v.canPublicLiquidate,
        dollarValue: v.dollarValue,
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

    const vaultData = await this.vaultDataRepository.find({
      where: {
        vault: { uuid: params.vaultUuid },
        collateralRatio: MoreThan(1)
      },
      order: orderObject,
      skip: params.pageSize * params.pageNumber,
      take: params.pageSize,
      relations: ['vault']
    })

    const vault = await this.vaultRepository.findOne({
      where: {
        uuid: params.vaultUuid
      }
    });

    const resultCount = await this.vaultDataRepository.count({
      where: {
        vault: { uuid: params.vaultUuid } 
      }, 
      relations: ['vault']
    });

    // return mapped vaultData and vault
    return {
      pageCount: Math.ceil(params.pageSize / resultCount),
      vault: {
        uuid: vault.uuid,
        chain: vault.vaultChain,
        canPublicLiquidate: vault.canPublicLiquidate,
        dollarValue: vault.dollarValue,
        gainRatio: vault.gainRatio,
        minimumRatio: vault.minimumRatio,
        name: vault.vaultName,
        priceOracleAddress: vault.priceOracleAddress,
        tokenAddress: vault.tokenAddress,
        tokenSymbol: vault.tokenSymbol,
        vaultAddress: vault.vaultAddress
      },
      vaultData: vaultData.map((v) => ({
        uuid: v.uuid,
        vaultNumber: v.vaultNumber,
        vaultUuid: vault.uuid,
        collateralAmount: v.collateralAmount,
        collateralRatio: v.collateralRatio,
        maiDebt: v.maiDebt,
        owner: v.owner,
        totalCollateralValue: v.totalCollateralValue,
    }))
    }
  }
}

export interface GetVaultDataParams {
  vaultUuid: string
  sortType: SortType
  pageSize: number
  pageNumber: number
}