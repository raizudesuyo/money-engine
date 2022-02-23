import { IData } from 'qi-common/interfaces/data';
import { config } from 'dotenv'
import { filter } from 'lodash'
config();

import { updateVaultData, updateVaultUserData } from './utils/QiDaoPrismaUtils';
import { LoggerSingleton } from './providers/LoggerSingleton';
import { IQiDaoVaultData } from './providers/qi-dao/IQiDaoVaultContract';
import { QiDaoVaultContractAdapterFactory } from './providers/qi-dao/smart-contract-service/QiDaoVaultContractAdapterFactory';
import { MaticWebSockerSingleton } from './providers/MaticWebSocketSingleton';
import { QiDaoVaultService } from './providers/qi-dao/QiDaoVaultService';

export const reloadAll = async () => {
    const log = LoggerSingleton.getInstance();
    const maticProvider = MaticWebSockerSingleton.getInstance();

    log.info('Starting reload all data');
    const data = require('../config.json') as IData;

    const validContracts = filter(data.maiVaultContracts, d => !!d.type)
    
    // prints check collateral percentage for each
    validContracts.forEach(async (contract) => {
        const vaultAdapter = QiDaoVaultContractAdapterFactory.getProvider({
            contractAddress: contract.address,
            contractProvider: maticProvider,
            contractType: contract.type
        });

        const vaultService = new QiDaoVaultService(vaultAdapter);
    
        const {
            dollarValue,
            gainRatio,
            minimumRatio,
            priceOracleAddress,
            stabilityPoolAddress,
            tokenAddress,
            vaultCount,
        } = await vaultService.getVault()
    
        const collateralData = await updateVaultData({
            canPublicLiquidate: !!stabilityPoolAddress.match('0x0000000000000000000000000000000000000000'),
            dollarValue: dollarValue.toString(),
            gainRatio,
            minimumRatio,
            priceOracleAddress,
            tokenAddress,
            tokenSymbol: contract.name, // not actually accurate
            vaultName: contract.name,
            vaultAddress: contract.address,
            vaultChain: contract.chain
        });
    
        const vaultCountN = vaultCount.toNumber();
        
        for(let vaultId = 0; vaultId < vaultCountN; vaultId++){
            log.info(`Syncing ${contract.name} # ${vaultId}`)
            const vaultUserData: IQiDaoVaultData = await vaultService.getVaultUserData(vaultId).catch((e) => {
                log.error(e)
                
                return null;
            });
            log.info(`synced ${JSON.stringify(vaultUserData)}`);
            if(vaultUserData) {
                updateVaultUserData({
                    collateralAmount: vaultUserData.collateralAmount.toString(),
                    collateralRatio: vaultUserData.collateralRatio.lt(1000) ? vaultUserData.collateralRatio.toNumber() : 1000,
                    maiDebt: vaultUserData.maiDebt.toString(),
                    owner: vaultUserData.owner,
                    totalCollateralValue: vaultUserData.collateralTotalAmount.toString(),
                    vault: collateralData,
                    vaultId
                })
            }
        }
    })
    
    // while updating data, already listen for events,
    // if event vault id does not exist, don't do anything, else update
}
