import { DataSource, Repository } from 'typeorm';
import { QiVault } from '../../../entity/QiVault.entity';
import { BigNumber } from 'ethers';

export const QiVaultRepository = (dataSource: DataSource): TQiVaultRepository => dataSource.getRepository(QiVault).extend({

  async updateVaultData(params: UpdateVaultParams) {
    
    // Because ThisType doesn't work on intellisense
    const fakeThis: Repository<QiVault> = this
    
    const {
      vaultName,
      tokenAddress,
      priceOracleAddress,
      dollarValue,
      tokenSymbol,
      canPublicLiquidate,
      gainRatio,
      minimumRatio,
      vaultAddress,
      vaultChain
    } = params;

    const vault = await fakeThis.findOne({
      where: {
        tokenAddress: params.tokenAddress
      },
    })

    const gainRationAsNumber = gainRatio.toNumber();
    const minimumRatioAsNumber = minimumRatio.toNumber();

    if (!vault) {
      const newVault = new QiVault({
        vaultName,
        tokenAddress,
        tokenSymbol,
        dollarValue,
        vaultAddress,
        gainRatio: gainRationAsNumber,
        minimumRatio: minimumRatioAsNumber,
        priceOracleAddress,
        canPublicLiquidate,
        vaultChain,
      });
      
      await fakeThis.insert(newVault);
      return newVault;
    } else {
      vault.dollarValue = dollarValue;
      return fakeThis.save(vault);
    }
  }

})

export type TQiVaultRepository = Repository<QiVault> & {
  updateVaultData(params: UpdateVaultParams): Promise<QiVault>;
}

interface UpdateVaultParams {
  vaultName?: string
  tokenAddress?: string
  tokenSymbol?: string
  priceOracleAddress?: string
  dollarValue: string
  canPublicLiquidate?: boolean
  gainRatio?: BigNumber
  minimumRatio?: BigNumber
  vaultAddress: string
  vaultChain: string
}