import { BigNumber, BigNumberish } from 'ethers';

export class BigNumberMath {
  static GetDelta(x: BigNumber, reference: BigNumber): [boolean, BigNumber] {
    const hasIncreased = x.gte(reference);
      
    const increase = x.sub(reference) 

    const delta = increase.div(reference.mul(100))

    // delta = (x - ref) / ref * 100 -> Assumes 18 decimals, or else this doesn't work
    // TODO: Check if it works on negatives
    return [hasIncreased, delta]
  }

  static GetDollarPriceOnRatio(params: GetDollarPriceOnRatioParams) {
    const normalizeDebtValue = BigNumberMath.normalizedTo18Decimals({
      value: params.debtDollarValue,
      decimals: params.debtDollarValueDecimals
    })
    const targetCollateralValue = BigNumber.from(params.targetRatio).mul(100).mul(normalizeDebtValue)
    const normalizedCollateralAmount = BigNumberMath.normalizedTo18Decimals({
      value: params.collateralAmount,
      decimals: params.collateralAmountDecimals
    })
    return targetCollateralValue.div(normalizedCollateralAmount);
  }

  static normalizedTo18Decimals({ decimals, value }: NormalizeTo18DecimalsParams) {
    return BigNumber.from(value).pow(BigNumber.from(18).sub(decimals))
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
  value: BigNumberish
  decimals: BigNumberish
}