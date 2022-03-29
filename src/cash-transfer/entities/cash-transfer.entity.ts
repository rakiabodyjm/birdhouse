import { IntersectionType } from '@nestjs/swagger'
import { Caesar } from 'src/caesar/entities/caesar.entity'
import { CaesarBank } from 'src/cash-transfer/entities/caesar-bank.entity'
import { TransferType } from 'src/cash-transfer/entities/transfer-type.entity'
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

export enum CashTransferAs {
  DEPOSIT = 'DEPOSIT',
  TRANSFER = 'TRANSFER',
  WITHDRAW = 'WITHDRAW',
  LOAN = 'LOAN',
  LOAN_PAYMENT = 'LOAN PAYMENT',
  INTEREST = 'INTEREST',
  BANK_FEES = 'BANK FEES',
}

export class CashTransferWithDraw {
  @ManyToOne(
    (type) => CaesarBank,
    (caesarBank) => caesarBank.cash_transfer_from,
  )
  caesar_bank_from: CaesarBank

  @ManyToOne(() => Caesar, (caesar) => caesar.cash_transfer_to)
  to: Caesar
}

export class CashTransferDeposit {
  @ManyToOne(() => CaesarBank, (caesarBank) => caesarBank.cash_transfer_to)
  caesar_bank_to: CaesarBank

  @ManyToOne(() => Caesar, (caesar) => caesar.cash_transfer_from)
  from: Caesar
}

class CashTransferType {
  @ManyToOne(() => CaesarBank, (caesarBank) => caesarBank.cash_transfer_to)
  caesar_bank_to: CaesarBank

  @ManyToOne(() => CaesarBank, (caesarBank) => caesarBank.cash_transfer_from)
  caesar_bank_from: CaesarBank
}

@Entity()
export class CashTransfer extends IntersectionType(
  IntersectionType(CashTransferWithDraw, CashTransferDeposit),
  CashTransferType,
) {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(
    (type) => TransferType,
    (transferType) => transferType.cash_transfer,
  )
  transfer_type: TransferType

  @Column()
  amount: number

  @Column({
    default: CashTransferAs.TRANSFER,
  })
  tag: CashTransferAs

  @CreateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
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
