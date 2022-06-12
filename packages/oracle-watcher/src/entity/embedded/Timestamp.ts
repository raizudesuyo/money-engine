import { CreateDateColumn, Index, UpdateDateColumn } from "typeorm"

export class Timestamp {
  @CreateDateColumn()
  @Index()
  createdAt: Date

  @UpdateDateColumn()
  @Index()
  updatedAt: Date
}