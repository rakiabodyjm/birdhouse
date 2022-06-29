import { Caesar } from 'src/caesar/entities/caesar.entity'
import { Bank } from 'src/cash-transfer/entities/bank.entity'
import { CashTransfer } from 'src/cash-transfer/entities/cash-transfer.entity'
import { OTP } from 'src/otp/entities/otp.entity'
import { Request } from 'src/request/entities/request.entity'
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
  Unique,
  UpdateDateColumn,
} from 'typeorm'

@Unique(['description', 'account_number', 'bank'])
@Index(['description', 'account_number'])
@Entity()
export class CaesarBank {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @JoinColumn({
    name: 'ceasar_id',
  })
  @ManyToOne((type) => Caesar, (caesar) => caesar.bank_accounts, {
    nullable: true,
    eager: true,
  })
  caesar: Caesar | null

  @JoinColumn({})
  @ManyToOne((type) => Bank, (bank) => bank.caesar_bank, {
    nullable: true,
    eager: true,
  })
  bank: Bank | null

  @Column({
    nullable: false,
  })
  description: string

  @OneToMany(
    (type) => CashTransfer,
    (cashTransfer) => cashTransfer.caesar_bank_from,
  )
  cash_transfer_from: CashTransfer[]

  @OneToMany(
    (type) => CashTransfer,
    (cashTransfer) => cashTransfer.caesar_bank_from,
  )
  cash_transfer_to: CashTransfer[]

  @OneToMany((type) => Request, (request) => request.caesar_bank)
  request: Request[]

  @OneToMany((type) => OTP, (otp) => otp.caesar_bank)
  otp: OTP[]

  @Column('decimal', {
    precision: 18,
    scale: 4,
    default: 0,
  })
  balance: number

  @Column({
    default: null,
  })
  account_number?: string

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
