import { BigNumberish } from 'ethers';

export class BigNumberMath {
  static GetDelta(x: bigint, reference: bigint): [boolean, bigint] {
    const hasIncreased = x > reference;
      
    const increase = x - reference 

    const delta = increase / (reference * BigInt(100))

    // delta = (x - ref) / ref * 100 -> Assumes 18 decimals, or else this doesn't work
    // TODO: Check if it works on negatives
    return [hasIncreased, delta]
  }

  static GetDollarPriceOnRatio(params: GetDollarPriceOnRatioParams): bigint {
    // TODO: Comment this out
    const normalizeDebtValue = BigNumberMath.normalizedTo18Decimals({
      value: BigInt(params.debtDollarValue),
      decimals: BigInt(params.debtDollarValueDecimals)
    })
    const targetCollateralValue = BigInt(params.targetRatio) * BigInt(100) * BigInt(normalizeDebtValue)
    const normalizedCollateralAmount = BigNumberMath.normalizedTo18Decimals({
      value: BigInt(params.collateralAmount),
      decimals: BigInt(params.collateralAmountDecimals)
    })
    return targetCollateralValue / normalizedCollateralAmount;
  }

  static pow(base: bigint, exponent: bigint): bigint {
    let result = BigInt(1);
    while (exponent > 0) {
        if (exponent % BigInt(2) === BigInt(1)) {
            result *= base;
        }
        base *= base;
        exponent /= BigInt(2);
    }
    return result;
  }

  static normalizedTo18Decimals({ decimals, value }: NormalizeTo18DecimalsParams): bigint {
    return BigNumberMath.pow(value, BigInt(18) - decimals);
  }
}

type GetDollarPriceOnRatioParams = {
  debtDollarValue: BigNumberish
  debtDollarValueDecimals: number
  collateralAmount: BigNumberish
  collateralAmountDecimals: number
  targetRatio: number
}

type NormalizeTo18DecimalsParams = {
  value: bigint
  decimals: bigint
}