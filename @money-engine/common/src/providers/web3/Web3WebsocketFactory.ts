import { MaticWebSockerSingleton } from './websocket-providers/MaticWebSocketSingleton';
import { ethers } from 'ethers';
import { FantomWebSocketSingleton } from './websocket-providers/FantomWebSocketSingleton';
import { LoggerSingleton } from '../LoggerSingleton';

export class Web3WebSocketFactory {

    static getProvider = (chain: Web3Chain): ethers.providers.WebSocketProvider => {
        switch (chain) {
            case 'polygon':
                return MaticWebSockerSingleton.getInstance();
            case 'fantom':
                return FantomWebSocketSingleton.getInstance();
            default:
                LoggerSingleton.getInstance().warn(`Unsupported chain ${chain}`)
                return null;
        }
    }

}

export type Web3Chain = 'polygon' | 'avalanche' | 'fantom' | 'ethereum' | 'moonriver' | 'harmony' | 'unknown'