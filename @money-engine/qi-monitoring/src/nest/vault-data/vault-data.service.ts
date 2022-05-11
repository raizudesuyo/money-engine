import { Injectable } from '@nestjs/common';
import { QiVaultData } from '../../entity';
import { dataSource } from '../../data-source'
import { MoreThan } from 'typeorm';
import { SortType } from '../app/RestApi.definitions';
import { QiVaultDataOnlyResponse } from '../../dtos'
import { BigNumber } from 'ethers';

@Injectable()
export class VaultDataService {

    constructor() {}
    
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

        const [vaultData, resultCount] = await dataSource.manager.findAndCount(QiVaultData, {
            where: {
              collateralRatio: MoreThan(1)
            },
            order: orderObject,
            skip: params.pageSize * params.pageNumber,
            take: params.pageSize,
            relations: ['vault']
        })

        return {
            pageCount: Math.ceil(resultCount / params.pageSize),
            vaultData: vaultData.map((v) => ({
                id: v.vaultId,
                collateralAmount: v.collateralAmount,
                collateralRatio: v.collateralRatio,
                maiDebt: v.maiDebt,
                owner: v.owner,
                totalCollateralValue: v.totalCollateralValue,
                vaultId: v.qiVaultId
            }))
        }
    }
}

export interface GetVaultDataParams {
    sortType: SortType
    pageSize: number
    pageNumber: number
}

