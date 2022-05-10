import { providers } from 'ethers';
import { config } from '../../../../config'

export class FantomWebSocketSingleton {

    private static instance: providers.WebSocketProvider;
    
    private constructor() {}

    public static getInstance(): providers.WebSocketProvider {
        if(!FantomWebSocketSingleton.instance) {
            FantomWebSocketSingleton.instance = new providers.WebSocketProvider(config.web3ProviderUrls.FANTOM_RPC);
        }

        return FantomWebSocketSingleton.instance;
    }
}
