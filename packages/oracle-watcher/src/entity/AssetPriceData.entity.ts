import {Entity, PrimaryGeneratedColumn, Column, OneToMany, UpdateDateColumn, CreateDateColumn, Index, ManyToOne} from "typeorm";
import { AssetPriceSource } from './AssetPriceSource.entity';
import { Asset } from './Asset.entity';
import { AssetDeltaAlert } from './AssetDeltaAlert.entity';
import { Timestamp } from './embedded/Timestamp';

@Entity()
export class AssetPriceData {

    @PrimaryGeneratedColumn("uuid")
    uuid: string;

    @ManyToOne(type => Asset, asset => asset.priceData)
    asset: Asset;

    @Column({type: 'varchar'})
    price: string

    @ManyToOne(type => AssetPriceSource, oracle => oracle.asset)
    oracle: Promise<AssetPriceSource>

    @ManyToOne(type => AssetDeltaAlert, deltaAlert => deltaAlert.referencePrice)
    referencedDeltaAlerts: Promise<AssetDeltaAlert>

    @Column(() => Timestamp)
    timestamp: Timestamp

    @Column({type: 'boolean', default: false})
    deleteFlag: boolean
}
