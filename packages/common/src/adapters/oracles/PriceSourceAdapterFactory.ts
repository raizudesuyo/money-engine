import { ethers } from "ethers";
import { OracleType } from '../../constants/oracle-types';
import { PriceSourceAdapter } from './PriceSourceAdapter';
import { IPriceSourceAdapter } from './IPriceSourceAdapter';

export interface IPriceSourceAdapterFactoryParam {
    contractType: OracleType
    contractAddress: string
    contractProvider: ethers.providers.BaseProvider
}

export class PriceSourceAdapterFactory {
  static getProvider = (params: IPriceSourceAdapterFactoryParam): IPriceSourceAdapter => {
    return new PriceSourceAdapter(params.contractAddress, params.contractProvider);
  } 
}