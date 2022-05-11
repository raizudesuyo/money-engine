import { BigNumber, ContractTransaction, Overrides } from 'ethers';

interface CalculatePropertiesResult {
    collateralVaultTimes100: BigNumber
    debtValue: BigNumber
}

export type ContractTransactionParams = Overrides & {
    from?: string | Promise<string>;
}

export interface IQiDaoVaultContractAdapter {

    /**
     * Actually the price oracle
     */
    ethPriceSource: () => Promise<string>

    _minimumCollateralPercentage: () => Promise<BigNumber>;

    vaultCount: () => Promise<BigNumber>;
    closingFee: () => Promise<BigNumber>;
    openingFee: () => Promise<BigNumber>;

    treasury: () => Promise<BigNumber>;
    tokenPeg: () => Promise<BigNumber>;

    vaultCollateral: (vaultId: number) => Promise<BigNumber>;
    vaultDebt: (vaultId: number) => Promise<BigNumber>;

    debtRatio: () => Promise<BigNumber>;
    gainRatio: () => Promise<BigNumber>;

    stabilityPool: () => Promise<string>;

    collateral: () => Promise<string>;

    priceSourceDecimals: () => Promise<BigNumber>;

    getDebtCeiling: () => Promise<BigNumber>;

    exists: (vaultId: number) => Promise<Boolean>;

    getClosingFee: () => Promise<BigNumber>

    getOpeningFee: () => Promise<BigNumber>;

    getTokenPriceSource: () => Promise<BigNumber>

    getEthPriceSource: () => Promise<BigNumber>

    createVault: (overrides: ContractTransactionParams) => Promise<ContractTransaction>;

    destroyVault: (vaultID: number, overrides: ContractTransactionParams) => Promise<ContractTransaction>;

    depositCollateral: (vaultID: number, amount: BigNumber, overrides: ContractTransactionParams) => Promise<ContractTransaction>;

    withdrawCollateral: (vaultID: number, amount: BigNumber, overrides: ContractTransactionParams) => Promise<ContractTransaction>;

    borrowToken: () => (vaultID: number, amount: BigNumber, overrides: ContractTransactionParams) => Promise<ContractTransaction>;

    payBackToken: (vaultId: number, amount: BigNumber, overrides: ContractTransactionParams) => Promise<ContractTransaction>;

    getPaid: (overrides: ContractTransactionParams) => Promise<ContractTransaction>

    checkCost: (vaultId: number) => Promise<BigNumber>

    checkExtract: (vaultId: number) => Promise<BigNumber>

    checkCollateralPercentage: (vaultId: number) => Promise<BigNumber>

    checkLiquidation: (vaultId: number) => Promise<Boolean>

    liquidateVault: (vaultId: number, overrides: ContractTransactionParams) => Promise<ContractTransaction>

    ownerOf: (vaultId: number) => Promise<string>

    amountDecimals: () => Promise<BigNumber>
}