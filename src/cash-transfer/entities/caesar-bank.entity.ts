import { Caesar } from 'src/caesar/entities/caesar.entity'
import { Bank } from 'src/cash-transfer/entities/bank.entity'
import { CashTransfer } from 'src/cash-transfer/entities/cash-transfer.entity'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class CaesarBank {
  @PrimaryGeneratedColumn('increment')
  id: number

  @JoinColumn({})
  @ManyToOne((type) => Caesar, (caesar) => caesar.bank_accounts, {
    nullable: true,
    eager: true,
  })
  caesar: Caesar | null

  @JoinColumn()
  @ManyToOne((type) => Bank, (bank) => bank.caesar_bank, {
    nullable: true,
    eager: true,
  })
  bank: Bank | null

  @Column({
    type: 'text',
    // nullable: true,
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

  @Column({
    default: 0,
  })
  balance: number
}
