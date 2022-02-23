import "reflect-metadata";
import { reloadAll } from './reloadAll';
import { listen } from './qiEventsListener';
import { createConnection } from 'typeorm';

// process all the shit first on the connection

createConnection().then(async () => {
    reloadAll()
    listen()
})