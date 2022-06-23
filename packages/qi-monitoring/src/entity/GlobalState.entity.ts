import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class GlobalState {

    constructor(init?: Partial<GlobalState>) {
      Object.assign(this, init);
    }

    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column()
    configName: string;

    @Column()
    value: string
}
