import {Entity, PrimaryGeneratedColumn, Column, Timestamp, ManyToOne, Index, UpdateDateColumn, CreateDateColumn, JoinColumn} from "typeorm";
import { AssetOracleWatcherIntegration } from "./integration/AssetOracleWatcherIntegration";
import { QiVault } from "./QiVault.entity";

@Entity()
export class QiVaultData {

    constructor(init?: Partial<QiVaultData>) {
        Object.assign(this, init);
    }

    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column()
    vaultNumber: number

    @Column({ type: "decimal" })
    @Index()
    collateralRatio: number;

    @Column()
    collateralAmount: string;

    @Column()
    totalCollateralValue: string;

    @Column()
    @Index()
    maiDebt: string;

    @Column({ type: "decimal" })
    predictedCollateralRatio: number;

    @Column()
    predictedCollateralAmount: string;

    @Column()
    predictedTotalCollateralValue: string;

    @Column()
    owner: string;

    @ManyToOne(type => QiVault, vault => vault.vaultData, { lazy: true })
    vault: Promise<QiVault>

    @Column()
    vaultUuid: string

    @CreateDateColumn()
    @Index()
    createdAt: Date

    @UpdateDateColumn()
    @Index()
    updatedAt: Date
    
}
