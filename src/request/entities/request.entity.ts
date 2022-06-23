import { Expose } from 'class-transformer'
import { CaesarBank } from 'src/cash-transfer/entities/caesar-bank.entity'
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
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

  @JoinColumn({
    name: 'caesar_bank',
  })
  @ManyToOne(() => CaesarBank, (caesarBank) => caesarBank.request)
  caesar_bank: CaesarBank

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

  @JoinColumn({
    name: 'bill_id',
    referencedColumnName: 'id',
  })
  @ManyToOne(() => Request, (req) => req.payments, {
    createForeignKeyConstraints: false,
  })
  bill: Request

  @Expose()
  @OneToMany(() => Request, (req) => req.bill, {})
  payments: Request[]

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
