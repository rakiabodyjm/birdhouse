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
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

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

  // @JoinColumn({
  //   name: 'transfer_type_id',
  // })
  // @ManyToOne(
  //   (type) => TransferType,
  //   (transferType) => transferType.cash_transfer,
  // )
  // transfer_type: TransferType

  @Column()
  amount: number

  // @Column({
  //   default: CashTransferAs.TRANSFER,
  // })
  // tag: CashTransferAs
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
  description: string

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

  @Column({
    default: 0,
  })
  bank_charge: number

  // @Column({
  //   default: null,
  // })
  // interest?: number

  @Column({
    default: 0,
  })
  remaining_balance_from: number

  @Column({ default: 0 })
  remaining_balance_to: number

  // @OneToOne(() => Loan, (l) => l.cash_transfer_reference)
  // loan_id: Loan

  // @JoinColumn({
  //   name: 'loan_payment_id',
  // })
  // @ManyToOne(() => Loan, (loan) => loan.payments)
  // loan_payment_id: Loan
  // // @Expose()
  // // interest_amount() {
  // //   if (this.as === CashTransferAs.LOAN) {
  // //     return this.amount + 0.01 * this.amount
  // //   }
  // // }

  // // @JoinColumn({
  // //   name: 'loan_id',
  // // })
  // // @ManyToOne(() => Loan, (loan) => loan.payments)
  // // loan: Loan

  // // @

  @JoinColumn({
    name: 'loan_id',
  })
  @ManyToOne(() => CashTransfer, (ct) => ct.payments)
  loan: CashTransfer

  @OneToMany(() => CashTransfer, (ct) => ct.loan)
  payments: CashTransfer[]

  @Expose()
  interest() {
    if (this.as !== CashTransferAs.LOAN) {
      return null
    }
    let interestRate = 0
    const dateNow = new Date(Date.now())
    const dateLoan = new Date(this.created_at)

    const whichShiftFrom: 'first' | 'second' =
      dateLoan.getHours() > 0 && dateLoan.getHours() < 14 ? 'first' : 'second'

    const whichShiftTo: 'first' | 'second' =
      dateNow.getHours() > 0 && dateNow.getHours() < 14 ? 'first' : 'second'

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

    const firstDayCount = whichShiftFrom === 'second' ? 0.5 : 1

    const lastDayCount = whichShiftTo === 'second' ? 1 : 0.5

    if (dayDiff === 0) {
      interestRate += lastDayCount
    }
    if (dayDiff === 1) {
      interestRate += firstDayCount + lastDayCount
    }
    if (dayDiff >= 2) {
      const endCountInterests = firstDayCount + lastDayCount
      interestRate += endCountInterests + 1 * (dayDiff - 1)

      // interestRate += dayDiff
    }

    return Number(interestRate.toFixed(4))
  }

  @Expose()
  total_amount() {
    const amount = this.amount || 0
    const bank_charge = this.bank_charge || 0
    const interest = this.interest() || 0

    return (
      amount +
      bank_charge +
      (this.as === CashTransferAs.LOAN ? (interest / 100) * amount : 0)
    )
  }
  loan_total() {
    if (this.as === CashTransferAs.LOAN) {
      return this.amount + this.amount * this.interest()
    }
    return null
    // if (this.as === CashTransferAs.LOAN) {
    //   const totalPaymentsDone =
    //     this.payments?.reduce((acc, ea) => {
    //       return acc + ea.amount
    //     }, 0) || 0
    //   const loanTotal = this.amount - totalPaymentsDone
    //   return loanTotal
    // }
    // return null
  }
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
