import { Logger, ILogObj } from 'tslog';

export class LoggerSingleton {

    private static instance: Logger<ILogObj>;
    
    private constructor() {}

    public static getInstance(): Logger<ILogObj> {
        if(!LoggerSingleton.instance) {
            LoggerSingleton.instance = new Logger();
        }

        return LoggerSingleton.instance;
    }
}