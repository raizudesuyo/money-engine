import { BigNumber } from 'ethers';
export class BigNumberMath {
  static GetDelta(x: BigNumber, reference: BigNumber) {
    const increased = x.gte(reference);
      
    const increase = increased 
      ? x.sub(reference) 
      : reference.sub(x);
    
    return increased 
      ? increase.div(reference.mul(100)).toNumber() 
      : reference.div(increase.mul(100)).toNumber() * -1;
  }
}