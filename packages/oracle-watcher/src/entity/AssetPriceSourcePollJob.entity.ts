import { Entity, PrimaryGeneratedColumn, Column, OneToMany, UpdateDateColumn, CreateDateColumn, Index, ManyToOne, OneToOne } from 'typeorm';
import { Asset } from './Asset.entity';
import { AssetPriceSource } from './AssetPriceSource.entity';
import { Timestamp } from './embedded/Timestamp';

@Entity()
export class AssetPriceSourcePollJob {

    constructor(init?: Partial<AssetPriceSourcePollJob>) {
        Object.assign(this, init);
    }

    @PrimaryGeneratedColumn("uuid")
    uuid: string;

    @OneToOne(type => AssetPriceSource, priceSourceOracle => priceSourceOracle.pollJob)
    priceSource: AssetPriceSource 

    @Column(() => Timestamp)
    timestamp: Timestamp

    @Column({type: 'boolean', default: false})
    deleteFlag: boolean
}
