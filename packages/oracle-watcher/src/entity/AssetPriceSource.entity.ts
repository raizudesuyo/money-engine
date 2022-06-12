import { Entity, PrimaryGeneratedColumn, Column, OneToMany, UpdateDateColumn, CreateDateColumn, Index, ManyToOne, OneToOne } from 'typeorm';
import { Asset } from './Asset.entity';
import { AssetPriceSourcePollJob } from './AssetPriceSourcePollJob.entity';
import { AssetDeltaAlert } from './AssetDeltaAlert.entity';
import { Timestamp } from './embedded/Timestamp';
import { AssetPriceData } from './AssetPriceData.entity';

@Entity()
export class AssetPriceSource {

    @PrimaryGeneratedColumn("uuid")
    uuid: string;

    @Column({ type: 'varchar' })
    oracleType: string;

    @Column({type: 'varchar'})
    oracleAddress: string

    @ManyToOne(type => Asset, asset => asset.priceSources)
    asset: Promise<Asset> 

    @OneToMany(type => AssetDeltaAlert, deltaAlert => deltaAlert.priceSource)
    deltaAlert: Promise<AssetDeltaAlert[]>

    @OneToMany(type => AssetPriceData, priceData => priceData.oracle)
    priceData: Promise<AssetPriceData[]>

    @OneToOne(type => AssetPriceSourcePollJob, pollJob => pollJob.priceSource, { eager: true })
    pollJob: AssetPriceSourcePollJob

    @Column(() => Timestamp)
    timestamp: Timestamp

    @Column({type: 'boolean', default: false})
    deleteFlag: boolean
}
