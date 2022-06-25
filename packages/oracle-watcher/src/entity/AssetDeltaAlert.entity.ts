import {Entity, PrimaryGeneratedColumn, Column, OneToMany, UpdateDateColumn, CreateDateColumn, Index, ManyToOne} from "typeorm";
import { AssetPriceSource } from './AssetPriceSource.entity';
import { Asset } from './Asset.entity';
import { AssetPriceData } from './AssetPriceData.entity';
import { Timestamp } from './embedded/Timestamp';

/**
 * Delta entry for an asset. If delta change from last reference price is met, then system will publish an event.
 */
@Entity()
export class AssetDeltaAlert {

    constructor(init?: Partial<AssetDeltaAlert>) {
        Object.assign(this, init);
    }

    @PrimaryGeneratedColumn("uuid")
    uuid: string;

    @Column({type: 'decimal'})
    delta: number

    @ManyToOne(type => Asset, asset => asset.priceData)
    asset: Promise<Asset>;

    @ManyToOne(type => AssetPriceData, assetPriceData => assetPriceData.referencedDeltaAlerts, { eager: true, nullable: true })
    referencePrice: AssetPriceData

    @ManyToOne(type => AssetPriceSource, priceSource => priceSource.deltaAlert)
    priceSource: Promise<AssetPriceSource>

    @Column(() => Timestamp)
    timestamp: Timestamp

    @Column({type: 'boolean', default: false})
    deleteFlag: boolean
}
