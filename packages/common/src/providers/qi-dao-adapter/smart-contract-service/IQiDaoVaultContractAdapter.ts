import { ContractTransaction, Overrides } from 'ethers';

interface CalculatePropertiesResult {
    collateralVaultTimes100: bigint
    debtValue: bigint
}

export type ContractTransactionParams = Overrides & {
    from?: string | Promise<string>;
}

export interface IQiDaoVaultContractAdapter {

    /**
     * Actually the price oracle
     */
    ethPriceSource: () => Promise<string>

    _minimumCollateralPercentage: () => Promise<bigint>;

    vaultCount: () => Promise<bigint>;
    closingFee: () => Promise<bigint>;
    openingFee: () => Promise<bigint>;

    treasury: () => Promise<bigint>;
    tokenPeg: () => Promise<bigint>;

    vaultCollateral: (vaultId: number) => Promise<bigint>;
    vaultDebt: (vaultId: number) => Promise<bigint>;

    debtRatio: () => Promise<bigint>;
    gainRatio: () => Promise<bigint>;

    stabilityPool: () => Promise<string>;

    collateral: () => Promise<string>;

    priceSourceDecimals: () => Promise<bigint>;

    getDebtCeiling: () => Promise<bigint>;

    exists: (vaultId: number) => Promise<Boolean>;

    getClosingFee: () => Promise<bigint>

    getOpeningFee: () => Promise<bigint>;

    getTokenPriceSource: () => Promise<bigint>

    getEthPriceSource: () => Promise<bigint>

    createVault: (overrides: ContractTransactionParams) => Promise<ContractTransaction>;

    destroyVault: (vaultID: number, overrides: ContractTransactionParams) => Promise<ContractTransaction>;

    depositCollateral: (vaultID: number, amount: bigint, overrides: ContractTransactionParams) => Promise<ContractTransaction>;

    withdrawCollateral: (vaultID: number, amount: bigint, overrides: ContractTransactionParams) => Promise<ContractTransaction>;

    borrowToken: () => (vaultID: number, amount: bigint, overrides: ContractTransactionParams) => Promise<ContractTransaction>;

    payBackToken: (vaultId: number, amount: bigint, overrides: ContractTransactionParams) => Promise<ContractTransaction>;

    getPaid: (overrides: ContractTransactionParams) => Promise<ContractTransaction>

    checkCost: (vaultId: number) => Promise<bigint>

    checkExtract: (vaultId: number) => Promise<bigint>

    checkCollateralPercentage: (vaultId: number) => Promise<bigint>

    checkLiquidation: (vaultId: number) => Promise<Boolean>

    liquidateVault: (vaultId: number, overrides: ContractTransactionParams) => Promise<ContractTransaction>

    ownerOf: (vaultId: number) => Promise<string>

    amountDecimals: () => Promise<bigint>
}