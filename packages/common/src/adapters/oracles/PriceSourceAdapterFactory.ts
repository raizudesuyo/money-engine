import { AbstractProvider } from "ethers";
import { OracleType } from '../../constants/oracle-types';
import { PriceSourceAdapter } from './PriceSourceAdapter';
import { IPriceSourceAdapter } from './IPriceSourceAdapter';
import { PriceSourceHybridSd3crvAdapter } from "./PriceSourceHybridSd3crvAdapter";

export interface IPriceSourceAdapterFactoryParam {
    contractType: OracleType
    contractAddress: string
    contractProvider: AbstractProvider
}

export class PriceSourceAdapterFactory {
  static getProvider = (params: IPriceSourceAdapterFactoryParam): IPriceSourceAdapter => {
    switch(params.contractType) {
      case "PriceSourceHybridSd3crv":
        return new PriceSourceHybridSd3crvAdapter(params.contractAddress, params.contractProvider)
      default:
        return new PriceSourceAdapter(params.contractAddress, params.contractProvider);
    }
  } 
}