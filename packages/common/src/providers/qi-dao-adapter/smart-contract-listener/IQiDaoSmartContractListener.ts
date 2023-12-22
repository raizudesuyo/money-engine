export interface IQiDaoSmartContractListener {
    onVaultCreated: (listener: (id: bigint, ownerAddress: string) => Promise<void>) => Promise<void>
    onCollateralDeposited: (listener: (id: bigint, amount: bigint) => Promise<void>) => Promise<void>
    onCollateralWithdrawn: (listener: (id: bigint, amount: bigint) => Promise<void>) => Promise<void>
    onTokenBorrow: (listener: (id: bigint, amount: bigint) => Promise<void>) => Promise<void>
    onTokenRepaid: (listener: (id: bigint, amount: bigint, closingFee: bigint) => Promise<void>) => Promise<void>
    onLiquidateVault: (listener: (id: bigint, owner: string, buyer: string, debtRepaid: bigint, collateralLiquidated: bigint, closingFee: bigint) => Promise<void>) => Promise<void>
}