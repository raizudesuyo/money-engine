import { DataSource, Repository } from 'typeorm';
import { QiVaultData } from '../../../entity/QiVaultData.entity';
import { QiVault } from '../../../entity/QiVault.entity';

export const QiVaultDataRepository = (dataSource: DataSource): TQiVaultDataRepository => dataSource.getRepository(QiVaultData).extend({
  async updateVaultUserData (params: UpdateVaultDataParams) {

    // Because ThisType doesn't work on intellisense
    const fakeThis: Repository<QiVaultData> = this

    const { 
        vaultNumber,
        collateralRatio,
        collateralAmount,
        totalCollateralValue,
        maiDebt,
        owner,
        vault
    } = params;

    let vaultData = await fakeThis.findOne({
      where: {
        vault: { vaultName: vault.vaultName, vaultChain: vault.vaultChain },
        vaultNumber
      }
    })

    if (!vaultData) {
      const newVaultData = new QiVaultData({
        collateralRatio,
        collateralAmount,
        totalCollateralValue,
        maiDebt,
        owner,
        predictedCollateralRatio: collateralRatio,
        predictedCollateralAmount: collateralAmount,
        predictedTotalCollateralValue: totalCollateralValue,
        vaultNumber: vaultNumber,
        vaultUuid: vault.uuid
      })

      await fakeThis.insert(newVaultData)
      return newVaultData
   } else {
      vaultData.predictedCollateralRatio = collateralRatio;
      vaultData.predictedCollateralAmount = collateralAmount;
      vaultData.predictedTotalCollateralValue = totalCollateralValue;
      vaultData.maiDebt = maiDebt
      return fakeThis.save(vaultData)
    }
  }
})

export type TQiVaultDataRepository = Repository<QiVaultData> & {
  updateVaultUserData(params: UpdateVaultDataParams): Promise<QiVaultData>;
}


interface UpdateVaultDataParams {
  vaultNumber: number
  collateralRatio: number,
  collateralAmount: string,
  totalCollateralValue: string,
  maiDebt: string,
  owner: string
  vault: QiVault
}