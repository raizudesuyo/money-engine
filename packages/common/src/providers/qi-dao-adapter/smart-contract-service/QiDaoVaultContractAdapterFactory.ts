import { ethers } from "ethers";
import { MaiVaultContractType } from "../../../interfaces";
import { IQiDaoVaultContractAdapter } from "./IQiDaoVaultContractAdapter";
import { CrosschainQiStablecoinV2Service } from "./adapters/CrosschainQiStablecoinV2Service";
import { QiStableCoinService } from './adapters/QiStableCoinService';
import Erc20QiStablecoinService from './adapters/Erc20QiStablecoinService';
import Erc20QiStablecoinWbtcService from "./adapters/Erc20QiStablecoinWbtcService";
import { LoggerSingleton } from '../../LoggerSingleton';

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
            case 'crosschainNativeQiStablecoin':
                return new Erc20QiStablecoinService(params.contractAddress, params.contractProvider);
            case 'crosschainQiStablecoinV2':
                return new CrosschainQiStablecoinV2Service(params.contractAddress, params.contractProvider);
            case 'erc20QiStablecoin':
                return new Erc20QiStablecoinService(params.contractAddress, params.contractProvider);
            case 'erc20QiStablecoincamwbtc':
            case 'crosschainQiStablecoinwbtc':
                return new Erc20QiStablecoinWbtcService(params.contractAddress, params.contractProvider);
            case 'erc20QiStablecoinwbtc':
                return new Erc20QiStablecoinWbtcService(params.contractAddress, params.contractProvider);
            default:
                LoggerSingleton.getInstance().warn(`undefined contract type ${params.contractType}`);
                return null;
        }
    } 
}