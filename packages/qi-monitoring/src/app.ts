import "reflect-metadata";
import { reloadAll } from './reloadAll';
import { listen } from './qiEventsListener';
import { createConnection } from 'typeorm';

export const syncAndListenToEvents = () => createConnection().then(async () => {
    reloadAll()
    listen()
})

export const listenToEvents = () => createConnection().then(async () => {
    listen()
})


export const syncOnly = () => createConnection().then(async () => {
    reloadAll()
});