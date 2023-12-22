import { JsonRpcProvider } from 'ethers';
import { config } from '../../../../config'

export class MaticJsonSingleton {

    private static instance: JsonRpcProvider;
    
    private constructor() {}

    public static getInstance(): JsonRpcProvider {
        if(!MaticJsonSingleton.instance) {
            MaticJsonSingleton.instance = new JsonRpcProvider(config.jsonRpcProviderUrls.MATIC_RPC);
        }

        return MaticJsonSingleton.instance;
    }
}