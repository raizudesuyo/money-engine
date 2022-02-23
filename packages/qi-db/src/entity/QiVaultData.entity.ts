import {Entity, PrimaryGeneratedColumn, Column, Timestamp, ManyToOne, Index, UpdateDateColumn, CreateDateColumn} from "typeorm";
import { QiVault } from "./QiVault.entity";

@Entity()
export class QiVaultData {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    vaultId: number

    @Column()
    @Index()
    collateralRatio: number;

    @Column()
    collateralAmount: string;

    @Column()
    totalCollateralValue: string;

    @Column()
    @Index()
    maiDebt: string;

    @Column()
    predictedCollateralRatio: number;

    @Column()
    predictedCollateralAmount: string;

    @Column()
    predictedTotalCollateralValue: string;

    @Column()
    owner: string;

    @ManyToOne(type => QiVault, vault => vault.vaultData)
    vault: QiVault

    @CreateDateColumn()
    @Index()
    createdAt: Date

    @UpdateDateColumn()
    @Index()
    updatedAt: Date
    
}
