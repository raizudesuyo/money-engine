import { MaticJsonSingleton } from './http-providers/MaticJsonSingleton';
import { ethers } from 'ethers';
import { FantomJsonSingleton } from './http-providers/FantomJsonSingleton';
import { LoggerSingleton } from '../LoggerSingleton';
import { Web3Chain } from '../../interfaces/Web3Chain';
import { AvalancheJsonSingleton } from './http-providers/AvalancheJsonSingleton';

export class Web3HttpFactory {

    static getProvider = (chain: Web3Chain): ethers.JsonRpcProvider => {
        switch (chain) {
            case 'polygon':
                return MaticJsonSingleton.getInstance();
            case 'fantom':
                return FantomJsonSingleton.getInstance();
            case 'avalanche':
                return AvalancheJsonSingleton.getInstance();
            default:
                LoggerSingleton.getInstance().warn(`Unsupported chain ${chain}`)
                return null;
        }
    }

}