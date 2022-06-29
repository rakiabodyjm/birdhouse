import { Expose } from 'class-transformer'
import { CaesarBank } from 'src/cash-transfer/entities/caesar-bank.entity'
import { OTP } from 'src/otp/entities/otp.entity'
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
  DECLINED = 'DECLINED',
}

@Entity()
@Index(['id', 'caesar_bank', 'ct_ref'])
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

  @OneToMany((type) => OTP, (otp) => otp.req_ref)
  otp: OTP[]

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
    default: false,
  })
  is_declined: boolean

  @Column({
    nullable: true,
  })
  ct_ref: string

  @Expose()
  status() {
    if (this.ct_ref) {
      return Status.APPROVED
    }
    if (this.is_declined) {
      return Status.PENDING
    }
    return Status.PENDING
  }

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
