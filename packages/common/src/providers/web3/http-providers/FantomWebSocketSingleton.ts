import { providers } from 'ethers';
import { config } from '../../../../config'

export class FantomJsonSingleton {

    private static instance: providers.JsonRpcProvider;
    
    private constructor() {}

    public static getInstance(): providers.JsonRpcProvider {
        if(!FantomJsonSingleton.instance) {
            FantomJsonSingleton.instance = new providers.JsonRpcProvider(config.jsonRpcProviderUrls.FANTOM_RPC);
        }

        return FantomJsonSingleton.instance;
    }
}
