import { BigNumber } from 'ethers'

export interface IQiDaoSmartContractListener {
    onVaultCreated: (listener: (id: BigNumber, ownerAddress: string) => Promise<void>) => Promise<void>
    onCollateralDeposited: (listener: (id: BigNumber, amount: BigNumber) => Promise<void>) => Promise<void>
    onCollateralWithdrawn: (listener: (id: BigNumber, amount: BigNumber) => Promise<void>) => Promise<void>
    onTokenBorrow: (listener: (id: BigNumber, amount: BigNumber) => Promise<void>) => Promise<void>
    onTokenRepaid: (listener: (id: BigNumber, amount: BigNumber, closingFee: BigNumber) => Promise<void>) => Promise<void>
    onLiquidateVault: (listener: (id: BigNumber, owner: string, buyer: string, debtRepaid: BigNumber, collateralLiquidated: BigNumber, closingFee: BigNumber) => Promise<void>) => Promise<void>
}