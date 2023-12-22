import { JsonRpcProvider } from 'ethers';
import { config } from '../../../../config'

export class AvalancheJsonSingleton {

    private static instance: JsonRpcProvider;
    
    private constructor() {}

    public static getInstance(): JsonRpcProvider {
        if(!AvalancheJsonSingleton.instance) {
            AvalancheJsonSingleton.instance = new JsonRpcProvider(config.jsonRpcProviderUrls.AVALANCHE_RPC);
        }

        return AvalancheJsonSingleton.instance;
    }
}
