import { CaesarBank } from 'src/cash-transfer/entities/caesar-bank.entity'
import { CashTransfer } from 'src/cash-transfer/entities/cash-transfer.entity'
import { Request } from 'src/request/entities/request.entity'
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity()
@Index(['id'])
@Index(['id', 'to', 'from'])
@Index(['id', 'request_id'])
@Index(['id', 'request'])
export class OTP {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    nullable: true,
  })
  code_length: string

  @Column()
  from: string

  @Column({
    nullable: true,
  })
  pin_expire: string

  @Column()
  to: string

  @Column({
    nullable: true,
  })
  price: string

  @Column({
    nullable: true,
  })
  request_id: string

  @JoinColumn({
    name: 'request',
  })
  @ManyToOne(() => Request, (request) => request.otp, {
    nullable: true,
  })
  request: Request

  @JoinColumn({
    name: 'cash_transfer',
  })
  @ManyToOne(() => CashTransfer, (cash_transfer) => cash_transfer.otp, {
    nullable: true,
  })
  cash_transfer: CashTransfer

  @JoinColumn({
    name: 'caesar_bank',
  })
  @ManyToOne(() => CaesarBank, (caesarBank) => caesarBank.otp, {
    nullable: true,
  })
  caesar_bank: CaesarBank

  @Column({ default: false })
  verified: boolean

  @Column({
    nullable: true,
  })
  code: string

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
