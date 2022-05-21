import { providers } from 'ethers';
import { config } from '../../../../config'

export class AvalancheJsonSingleton {

    private static instance: providers.JsonRpcProvider;
    
    private constructor() {}

    public static getInstance(): providers.JsonRpcProvider {
        if(!AvalancheJsonSingleton.instance) {
            AvalancheJsonSingleton.instance = new providers.JsonRpcProvider(config.jsonRpcProviderUrls.AVALANCHE_RPC);
        }

        return AvalancheJsonSingleton.instance;
    }
}
