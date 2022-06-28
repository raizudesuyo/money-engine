import {Entity, PrimaryGeneratedColumn, Column, OneToMany, UpdateDateColumn, CreateDateColumn, Index} from "typeorm";
import { AssetOracleWatcherIntegration } from "./integration/AssetOracleWatcherIntegration";
import { QiVaultData } from './QiVaultData.entity';

@Entity()
export class QiVault {

    constructor(init?: Partial<QiVault>) {
      Object.assign(this, init);
    }

    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column()
    vaultName: string;

    @Column()
    vaultChain: string;

    @Column()
    tokenAddress: string;

    @Column()
    tokenSymbol: string;

    @Column()
    vaultAddress: string;

    @Column()
    dollarValue: string;

    @Column({type: 'int2', default: 8})
    decimal: number

    @Column()
    priceOracleAddress: string;

    @Column()
    minimumRatio: number;

    @Column()
    gainRatio: number;

    @Column()
    canPublicLiquidate: boolean;

    @Column()
    oracleType: string;

    @Column(() => AssetOracleWatcherIntegration)
    oracleWatcherIntegration: AssetOracleWatcherIntegration;

    @OneToMany(type => QiVaultData, vaultData => vaultData.vault, { lazy: true })
    vaultData: Promise<QiVaultData[]>

    @CreateDateColumn()
    @Index()
    createdAt: Date

    @UpdateDateColumn()
    @Index()
    updatedAt: Date
}
