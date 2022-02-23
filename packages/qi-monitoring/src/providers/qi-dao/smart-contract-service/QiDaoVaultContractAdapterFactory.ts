import { ethers } from "ethers";
import { MaiVaultContractType } from "qi-common/interfaces/data";
import { IQiDaoVaultContractAdapter } from "./IQiDaoVaultContractAdapter";
import { CrosschainQiStablecoinV2Service } from "./adapters/CrosschainQiStablecoinV2Service";
import { QiStableCoinService } from './adapters/QiStableCoinService';
import Erc20QiStablecoinService from './adapters/Erc20QiStablecoinService';
import Erc20QiStablecoinWbtcService from "./adapters/Erc20QiStablecoinWbtcService";

export interface IQiDaoVaultContractAdapterFactoryParam {
    contractType: MaiVaultContractType
    contractAddress: string
    contractProvider: ethers.providers.BaseProvider
}

export class QiDaoVaultContractAdapterFactory {
    static getProvider = (params: IQiDaoVaultContractAdapterFactoryParam): IQiDaoVaultContractAdapter => {
        switch (params.contractType) {
            case 'QiStablecoin':
                return new QiStableCoinService(params.contractAddress, params.contractProvider);
            case 'crosschainQiStablecoin':
                return new Erc20QiStablecoinService(params.contractAddress, params.contractProvider);
            case 'crosschainQiStablecoinV2':
                return new CrosschainQiStablecoinV2Service(params.contractAddress, params.contractProvider);
            case 'erc20QiStablecoin':
                return new Erc20QiStablecoinService(params.contractAddress, params.contractProvider);
            case 'erc20QiStablecoincamwbtc':
                return new Erc20QiStablecoinWbtcService(params.contractAddress, params.contractProvider);
            case 'erc20QiStablecoinwbtc':
                return new Erc20QiStablecoinWbtcService(params.contractAddress, params.contractProvider);
            default:
                throw new Error('undefined contract type');
        }
    } 
}