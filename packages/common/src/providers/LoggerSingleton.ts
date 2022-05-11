import { Logger } from 'tslog';

export class LoggerSingleton {

    private static instance: Logger;
    
    private constructor() {}

    public static getInstance(): Logger {
        if(!LoggerSingleton.instance) {
            LoggerSingleton.instance = new Logger();
        }

        return LoggerSingleton.instance;
    }
}