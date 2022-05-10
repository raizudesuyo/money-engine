import { MaticJsonSingleton } from './http-providers/MaticJsonSingleton';
import { ethers } from 'ethers';
import { FantomJsonSingleton } from './http-providers/FantomWebSocketSingleton';
import { LoggerSingleton } from '../LoggerSingleton';
import { Web3Chain } from '../../interfaces/Web3Chain';

export class Web3HttpFactory {

    static getProvider = (chain: Web3Chain): ethers.providers.JsonRpcProvider => {
        switch (chain) {
            case 'polygon':
                return MaticJsonSingleton.getInstance();
            case 'fantom':
                return FantomJsonSingleton.getInstance();
            default:
                LoggerSingleton.getInstance().warn(`Unsupported chain ${chain}`)
                return null;
        }
    }

}