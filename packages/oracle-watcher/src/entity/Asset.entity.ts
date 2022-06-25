import {Entity, PrimaryGeneratedColumn, Column, OneToMany, UpdateDateColumn, CreateDateColumn, Index} from "typeorm";
import { AssetPriceData } from "./AssetPriceData.entity";
import { AssetPriceSource } from './AssetPriceSource.entity';
import { AssetDeltaAlert } from './AssetDeltaAlert.entity';
import { Timestamp } from "./embedded/Timestamp";

@Entity()
export class Asset {

    constructor(init?: Partial<Asset>) {
        Object.assign(this, init);
    }

    @PrimaryGeneratedColumn("uuid")
    uuid: string;

    @Column({ type: 'varchar' })
    name: string;

    @Column({ type: 'varchar' })
    chain: string;

    @Column({ type: 'varchar' })
    // If an in-chain asset
    address: string

    @OneToMany(type => AssetPriceSource, priceSource => priceSource.asset, { eager: true })
    priceSources: AssetPriceSource[]

    @OneToMany(type => AssetPriceData, priceData => priceData.asset, { eager: true })
    priceData: AssetPriceData[]

    @OneToMany(type => AssetDeltaAlert, deltaAlert => deltaAlert.asset, { eager: true })
    deltaAlerts: AssetDeltaAlert[]

    @Column(() => Timestamp)
    timestamp: Timestamp

    @Column({type: 'boolean', default: false})
    deleteFlag: boolean
}
