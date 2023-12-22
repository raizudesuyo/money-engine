import { JsonRpcProvider } from 'ethers';
import { config } from '../../../../config'

export class FantomJsonSingleton {

    private static instance: JsonRpcProvider;
    
    private constructor() {}

    public static getInstance(): JsonRpcProvider {
        if(!FantomJsonSingleton.instance) {
            FantomJsonSingleton.instance = new JsonRpcProvider(config.jsonRpcProviderUrls.FANTOM_RPC);
        }

        return FantomJsonSingleton.instance;
    }
}
