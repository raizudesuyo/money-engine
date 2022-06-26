import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Asset } from './Asset.entity';
import { AssetPriceSource } from './AssetPriceSource.entity';
import { Timestamp } from './embedded/Timestamp';
import { PollPriority } from '@money-engine/common';

@Entity()
export class AssetPriceSourcePollJob {

    constructor(init?: Partial<AssetPriceSourcePollJob>) {
        Object.assign(this, init);
    }

    @PrimaryGeneratedColumn("uuid")
    uuid: string;

    @Column({ type: 'number'})
    pollPriority: PollPriority

    @OneToOne(type => AssetPriceSource, priceSourceOracle => priceSourceOracle.pollJob)
    priceSource: AssetPriceSource 

    @Column(() => Timestamp)
    timestamp: Timestamp

    @Column({type: 'boolean', default: false})
    deleteFlag: boolean
}
