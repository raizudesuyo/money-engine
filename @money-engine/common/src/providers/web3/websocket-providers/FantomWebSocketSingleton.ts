import { providers } from 'ethers';

export class FantomWebSocketSingleton {

    private static instance: providers.WebSocketProvider;
    
    private constructor() {}

    public static getInstance(): providers.WebSocketProvider {
        if(!FantomWebSocketSingleton.instance) {
            FantomWebSocketSingleton.instance = new providers.WebSocketProvider(process.env.FANTOM_RPC);
        }

        return FantomWebSocketSingleton.instance;
    }
}
