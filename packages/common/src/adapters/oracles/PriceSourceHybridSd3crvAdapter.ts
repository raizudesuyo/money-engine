import { AbstractProvider } from 'ethers';
import { PriceSourceHybridSd3crv, PriceSourceHybridSd3crv__factory } from '../../../typechain';
import { IPriceSourceAdapter } from './IPriceSourceAdapter';

export class PriceSourceHybridSd3crvAdapter implements IPriceSourceAdapter {

  protected smartContract: PriceSourceHybridSd3crv;

  constructor(
    contractAddress: string, 
    provider: AbstractProvider) {
    this.smartContract = PriceSourceHybridSd3crv__factory.connect(contractAddress, provider);
  }
  
  latestRoundData = () => this.smartContract.latestRoundData()
  
}