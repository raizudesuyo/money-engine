import { BigNumber, ContractTransaction, ethers, Overrides } from 'ethers';
import { MaiVaultContractType } from 'qi-common/interfaces/data';
import { IQiDaoSmartContractListener } from './IQiDaoSmartContractListener';
import { Erc20QiStablecoinListenerAdapter } from './adapters/Erc20QiStablecoinListenerAdapter';

export interface IQiDaoSmartContractListenerFactoryParams {
    contractType: MaiVaultContractType
    contractAddress: string
    contractProvider: ethers.providers.BaseProvider
}

export class QiDaoSmartContractListenerFactory {
    static getProvider = (params: IQiDaoSmartContractListenerFactoryParams): IQiDaoSmartContractListener => {
        return new Erc20QiStablecoinListenerAdapter(params.contractAddress, params.contractProvider)
    }
}