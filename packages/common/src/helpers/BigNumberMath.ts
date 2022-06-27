import { BigNumber } from 'ethers';

export class BigNumberMath {
  static GetDelta(x: BigNumber, reference: BigNumber): [boolean, BigNumber] {
    const hasIncreased = x.gte(reference);
      
    const increase = x.sub(reference) 

    const delta = increase.div(reference.mul(100))

    return [hasIncreased, delta]
  }
}