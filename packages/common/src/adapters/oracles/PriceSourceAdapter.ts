import { BigNumber, providers } from 'ethers';
import { IPriceSource, IPriceSource__factory } from '../../../typechain';
import { IPriceSourceAdapter } from './IPriceSourceAdapter';

export class PriceSourceAdapter implements IPriceSourceAdapter {

  protected smartContract: IPriceSource;

  constructor(
    contractAddress: string, 
    provider: providers.BaseProvider) {
    this.smartContract = IPriceSource__factory.connect(contractAddress, provider);
  }
  
  latestRoundData = () => this.smartContract.latestRoundData()
  
}