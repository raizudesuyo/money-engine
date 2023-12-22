import { AbstractProvider } from 'ethers';
import { Erc20QiStablecoinwbtc, Erc20QiStablecoincamwbtc, Erc20QiStablecoinwbtc__factory } from '../../../../../typechain';
import Erc20QiStablecoinService from './Erc20QiStablecoinService';

// Actually an Adapter
export default class Erc20QiStablecoinWbtcService extends Erc20QiStablecoinService {

    protected smartContract: Erc20QiStablecoinwbtc | Erc20QiStablecoincamwbtc

    constructor(contractAddress: string, provider: AbstractProvider) {
        super(contractAddress, provider);
        this.smartContract = Erc20QiStablecoinwbtc__factory.connect(contractAddress, provider)
    }

    amountDecimals = async () => BigInt(8);
}