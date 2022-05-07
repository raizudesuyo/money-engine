import { Injectable } from '@nestjs/common';
import { QiVaultData } from 'src/entity';
import { MoreThan, getConnection } from 'typeorm';
import { VaultDataOnlyResult, SortType } from '../app/app.definitions';

@Injectable()
export class VaultDataService {

    constructor() {}
    
    async getVaultData(
        params: GetVaultDataParams
    ): Promise<VaultDataOnlyResult> {

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

        const [vaultData, resultCount] = await getConnection().manager.findAndCount(QiVaultData, {
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
            vaultData
        }
    }
}

export interface GetVaultDataParams {
    sortType: SortType
    pageSize: number
    pageNumber: number
}

