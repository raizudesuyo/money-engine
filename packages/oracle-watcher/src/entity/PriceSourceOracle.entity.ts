import {Entity, PrimaryGeneratedColumn, Column, OneToMany, UpdateDateColumn, CreateDateColumn, Index} from "typeorm";

@Entity()
export class PriceSourceOracle {

    @PrimaryGeneratedColumn("uuid")
    uuid: string;

    @Column({ type: 'string' })
    oracleType: string;
}
