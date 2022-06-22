import {Entity, PrimaryGeneratedColumn, Column, OneToMany, UpdateDateColumn, CreateDateColumn, Index} from "typeorm";
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

    @Column()
    priceOracleAddress: string;

    @Column()
    minimumRatio: number;

    @Column()
    gainRatio: number;

    @Column()
    canPublicLiquidate: boolean;

    @OneToMany(type => QiVaultData, vaultData => vaultData.vault, { eager: true })
    vaultData: QiVaultData[]

    @CreateDateColumn()
    @Index()
    createdAt: Date

    @UpdateDateColumn()
    @Index()
    updatedAt: Date
}
