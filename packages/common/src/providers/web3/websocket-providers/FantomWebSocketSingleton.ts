import { WebSocketProvider } from 'ethers';
import { config } from '../../../../config'

export class FantomWebSocketSingleton {

    private static instance: WebSocketProvider;
    
    private constructor() {}

    public static getInstance(): WebSocketProvider {
        if(!FantomWebSocketSingleton.instance) {
            FantomWebSocketSingleton.instance = new WebSocketProvider(config.web3ProviderUrls.FANTOM_RPC);
        }

        return FantomWebSocketSingleton.instance;
    }
}
