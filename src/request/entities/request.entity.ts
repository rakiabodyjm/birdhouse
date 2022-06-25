import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

export enum CashTransferAs {
  DEPOSIT = 'DEPOSIT',
  TRANSFER = 'TRANSFER',
  WITHDRAW = 'WITHDRAW',
  LOAN = 'LOAN',
  LOAD = 'LOAD',
  'LOAN PAYMENT' = 'LOAN PAYMENT',
  'LOAD PAYMENT' = 'LOAD PAYMENT',
}
export enum Status {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  DECLINED = 'DECLINED',
}

@Entity()
@Index(['id'])
export class Request {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    type: 'text',
    nullable: true,
  })
  description?: string

  @Column()
  caesar_bank: string

  @Column('decimal', {
    precision: 18,
    scale: 4,
  })
  amount: number

  @Column({
    default: CashTransferAs.LOAN,
  })
  as: CashTransferAs

  @Column({
    default: Status.PENDING,
  })
  status: Status

  @Column({
    nullable: true,
  })
  ct_ref: string

  @CreateDateColumn({
    type: 'datetime',
  })
  created_at: Date

  @UpdateDateColumn({
    type: 'datetime',
  })
  updated_at: Date

  @DeleteDateColumn({
    type: 'datetime',
  })
  deleted_at: Date
}
