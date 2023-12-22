import { AbstractProvider } from 'ethers';
import { MaiVaultContractType } from '../../../interfaces/data';
import { IQiDaoSmartContractListener } from './IQiDaoSmartContractListener';
import { Erc20QiStablecoinListenerAdapter } from './adapters/Erc20QiStablecoinListenerAdapter';

export interface IQiDaoSmartContractListenerFactoryParams {
    contractType: MaiVaultContractType
    contractAddress: string
    contractProvider: AbstractProvider
}

export class QiDaoSmartContractListenerFactory {
    static getProvider = (params: IQiDaoSmartContractListenerFactoryParams): IQiDaoSmartContractListener => {
        return new Erc20QiStablecoinListenerAdapter(params.contractAddress, params.contractProvider)
    }
}