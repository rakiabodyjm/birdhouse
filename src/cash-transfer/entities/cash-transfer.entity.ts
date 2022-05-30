import { RevertCashTransfer } from './revert-cash-transfer.entity'
import { IntersectionType } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { Caesar } from 'src/caesar/entities/caesar.entity'
import { CaesarBank } from 'src/cash-transfer/entities/caesar-bank.entity'
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { SQLDateGenerator } from 'src/utils/SQLDateGenerator'

export enum CashTransferAs {
  DEPOSIT = 'DEPOSIT',
  TRANSFER = 'TRANSFER',
  WITHDRAW = 'WITHDRAW',
  LOAN = 'LOAN',
  'LOAN PAYMENT' = 'LOAN PAYMENT',
  // INTEREST = 'INTEREST',
  // 'BANK FEES' = 'BANK FEES',
}

export class CashTransferWithDraw {
  @JoinColumn()
  @ManyToOne(
    (type) => CaesarBank,
    (caesarBank) => caesarBank.cash_transfer_from,
  )
  caesar_bank_from: CaesarBank

  @JoinColumn()
  @ManyToOne(() => Caesar, (caesar) => caesar.cash_transfer_to)
  to: Caesar
}

export class CashTransferDeposit {
  @JoinColumn()
  @ManyToOne(() => CaesarBank, (caesarBank) => caesarBank.cash_transfer_to)
  caesar_bank_to: CaesarBank

  @JoinColumn()
  @ManyToOne(() => Caesar, (caesar) => caesar.cash_transfer_from)
  from: Caesar
}

export class CashTransferType {
  @JoinColumn()
  @ManyToOne(() => CaesarBank, (caesarBank) => caesarBank.cash_transfer_to)
  caesar_bank_to: CaesarBank

  @JoinColumn()
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

  @Column('decimal', {
    precision: 18,
    scale: 4,
  })
  amount: number

  @Column({ nullable: true })
  ref_num: string

  @Column({
    default: CashTransferAs.TRANSFER,
  })
  as: CashTransferAs

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

  @Column({
    type: 'text',
    nullable: true,
  })
  description?: string

  @Column({
    type: 'text',
    nullable: true,
  })
  message?: string

  @JoinColumn({
    name: 'caesar_bank_to',
  })
  @ManyToOne(() => CaesarBank, (caesarBank) => caesarBank.cash_transfer_to)
  caesar_bank_to: CaesarBank

  @JoinColumn({
    name: 'caesar_bank_from',
  })
  @ManyToOne(() => CaesarBank, (caesarBank) => caesarBank.cash_transfer_from)
  caesar_bank_from: CaesarBank

  @JoinColumn({
    name: 'caesar_to',
  })
  @ManyToOne(() => Caesar, (caesar) => caesar.cash_transfer_to)
  to: Caesar

  @JoinColumn({
    name: 'caesar_from',
  })
  @ManyToOne(() => Caesar, (caesar) => caesar.cash_transfer_from)
  from: Caesar

  @Column('decimal', {
    precision: 18,
    scale: 4,
    default: 0,
  })
  bank_charge: number

  @Column('decimal', {
    precision: 18,
    scale: 4,
  })
  remaining_balance_from?: number

  @Column('decimal', {
    precision: 18,
    scale: 4,
  })
  remaining_balance_to: number

  @JoinColumn({
    name: 'loan_id',
    referencedColumnName: 'id',
  })
  @ManyToOne(() => CashTransfer, (ct) => ct.payments)
  loan: CashTransfer

  @Expose()
  @OneToMany(() => CashTransfer, (ct) => ct.loan, {})
  payments: CashTransfer[]

  @Column({
    default: null,
  })
  loan_paid?: true

  @Column('decimal', {
    default: null,
    nullable: true,
    precision: 4,
    scale: 2,
  })
  override_interest?: number

  @Column({ default: null })
  commmision?: number

  @OneToOne(() => RevertCashTransfer, (rt) => rt.cash_transfer)
  revert_cash_transfer: RevertCashTransfer

  @Expose()
  interest() {
    if (this.as !== CashTransferAs.LOAN) {
      return null
    }
    if (this.loan_paid) {
      return null
    }
    if (this.override_interest) {
      return this.override_interest
    }
    // let interestRate = 0
    const dateNow = new Date(Date.now())
    const dateLoan = new Date(this.created_at)

    // const whichShiftFrom: 'first' | 'second' =
    //   dateLoan.getHours() > 0 && dateLoan.getHours() < 14 ? 'first' : 'second'

    // const whichShiftTo: 'first' | 'second' =
    //   dateNow.getHours() > 0 && dateNow.getHours() < 14 ? 'first' : 'second'

    // const whichShiftTo: 'first' | 'second' =
    //   dateNow.getHours() > 0 && dateNow.getHours() < 14 ? 'first' : 'second'

    const dayFrom = new Date(
      `${
        monthNames[dateLoan.getMonth()]
      } ${dateLoan.getDate()}, ${dateLoan.getFullYear()}`,
    )
    const dayTo = new Date(
      `${
        monthNames[dateNow.getMonth()]
      } ${dateNow.getDate()}, ${dateLoan.getFullYear()}`,
    )

    const dayDiff = (dayTo.getTime() - dayFrom.getTime()) / (1000 * 3600 * 24)

    // const firstDayCount = whichShiftFrom === 'second' ? 0.5 : 1
    // const firstDayCount = 1

    // const lastDayCount = whichShiftTo === 'second' ? 1 : 0.5
    if (dateNow.getDay() - dateLoan.getDay() < 1) {
      return dayDiff - 1
    }
    if (dayDiff === 0) {
      // interestRate = whichShiftFrom === whichShiftTo ? 0.5 : 1
      // return 1
      return dayDiff + 1
    }

    // if (dayDiff === 1) {
    //   interestRate += firstDayCount + lastDayCount
    // }
    // if (dayDiff >= 2) {
    //   const endCountInterests = firstDayCount + lastDayCount
    //   interestRate += endCountInterests + 1 * (dayDiff - 1)

    //   // interestRate += dayDiff
    // }

    return Number(dayDiff)
  }

  @Column({
    default: null,
  })
  is_loan_paid: boolean

  @Expose()
  total_amount() {
    const amount = this.amount || 0
    const bank_charge = this.bank_charge || 0
    const interest = this.interest() || 0

    return (
      amount +
      // bank_charge +
      (this.as === CashTransferAs.LOAN ? (interest / 100) * amount : 0)
    )
  }

  @Column({
    type: 'datetime',
    // default: new SQLDateGenerator().timeNow().getSQLDate(),
    default: () => 'CURRENT_TIMESTAMP',
  })
  original_created_at: Date
}

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]
