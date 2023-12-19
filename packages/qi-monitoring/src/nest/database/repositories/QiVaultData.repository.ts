import { DataSource, MoreThanOrEqual, Repository } from 'typeorm';
import { QiVaultData } from '../../../entity/QiVaultData.entity';
import { QiVault } from '../../../entity/QiVault.entity';

export const QiVaultDataRepository = (dataSource: DataSource): TQiVaultDataRepository => dataSource.getRepository(QiVaultData).extend({
  async updateVaultData (params: UpdateVaultDataParams) {

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
        vaultNumber: vaultNumber,
        vaultUuid: vault.uuid,
        isEmpty: collateralAmount === '0'
      })

      await fakeThis.insert(newVaultData)
      return newVaultData
   } else {
      vaultData.collateralRatio = collateralRatio;
      vaultData.collateralAmount = collateralAmount;
      vaultData.totalCollateralValue = totalCollateralValue;
      vaultData.maiDebt = maiDebt
      vaultData.isEmpty = collateralAmount === '0'
      return fakeThis.save(vaultData)
    }
  },

  async findNonEmptyVaults(params?: FindNonEmptyVaultsParams): Promise<QiVaultData[]> {
    // Because ThisType doesn't work on intellisense
    // const fakeThis: Repository<QiVaultData> = this

    // if(!!params) {
    //   return fakeThis.find({
    //     where: {
    //       collateralAmount: {}
    //     }
    //   })
    // }
    return [];
  },

  async findVaultDataNearestTillLiquidation(params: FindVaultDataNearestTillLiquidationParams): Promise<QiVaultData> {
    const fakeThis: Repository<QiVaultData> = this

    const { vaultMinimumRatio, vaultUuid } = params;

    return fakeThis.findOne({
      where: {
        vaultUuid: vaultUuid,
        collateralRatio: MoreThanOrEqual(vaultMinimumRatio)
      }
    })
  }
})

export type TQiVaultDataRepository = Repository<QiVaultData> & {
  updateVaultData(params: UpdateVaultDataParams): Promise<QiVaultData>;
  findNonEmptyVaults(params: FindNonEmptyVaultsParams): Promise<QiVaultData[]>;
  findVaultDataNearestTillLiquidation(params: FindVaultDataNearestTillLiquidationParams): Promise<QiVaultData>;
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

interface FindNonEmptyVaultsParams {
  vaultUuid: string[]
}

interface FindVaultDataNearestTillLiquidationParams {
  vaultUuid: string,
  vaultMinimumRatio: number
}