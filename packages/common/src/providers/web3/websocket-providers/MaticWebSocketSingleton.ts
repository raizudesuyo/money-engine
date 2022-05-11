import { providers } from 'ethers';
import { config } from '../../../../config'

export class MaticWebSockerSingleton {

    private static instance: providers.WebSocketProvider;
    
    private constructor() {}

    public static getInstance(): providers.WebSocketProvider {
        if(!MaticWebSockerSingleton.instance) {
            MaticWebSockerSingleton.instance = new providers.WebSocketProvider(config.web3ProviderUrls.MATIC_RPC);
        }

        return MaticWebSockerSingleton.instance;
    }
}