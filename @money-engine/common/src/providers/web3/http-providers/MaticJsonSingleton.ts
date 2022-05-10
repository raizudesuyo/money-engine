import { providers } from 'ethers';
import { config } from '../../../../config'

export class MaticJsonSingleton {

    private static instance: providers.JsonRpcProvider;
    
    private constructor() {}

    public static getInstance(): providers.JsonRpcProvider {
        if(!MaticJsonSingleton.instance) {
            MaticJsonSingleton.instance = new providers.JsonRpcProvider(config.jsonRpcProviderUrls.MATIC_RPC);
        }

        return MaticJsonSingleton.instance;
    }
}