import { CreateDateColumn, Index, UpdateDateColumn } from "typeorm"

export class Timestamp {

  constructor(init?: Partial<Timestamp>) {
    Object.assign(this, init);
  }

  @CreateDateColumn()
  @Index()
  createdAt: Date

  @UpdateDateColumn()
  @Index()
  updatedAt: Date
}