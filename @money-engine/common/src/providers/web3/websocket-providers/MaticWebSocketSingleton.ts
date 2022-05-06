import { providers } from 'ethers';
export class MaticWebSockerSingleton {

    private static instance: providers.WebSocketProvider;
    
    private constructor() {}

    public static getInstance(): providers.WebSocketProvider {
        if(!MaticWebSockerSingleton.instance) {
            MaticWebSockerSingleton.instance = new providers.WebSocketProvider(process.env.MATIC_RPC);
        }

        return MaticWebSockerSingleton.instance;
    }
}