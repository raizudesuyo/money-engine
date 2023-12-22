import { WebSocketProvider } from 'ethers';
import { config } from '../../../../config'

export class MaticWebSockerSingleton {

    private static instance: WebSocketProvider;
    
    private constructor() {}

    public static getInstance(): WebSocketProvider {
        if(!MaticWebSockerSingleton.instance) {
            MaticWebSockerSingleton.instance = new WebSocketProvider(config.web3ProviderUrls.MATIC_RPC);
        }

        return MaticWebSockerSingleton.instance;
    }
}