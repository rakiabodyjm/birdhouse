import { Caesar } from 'src/caesar/entities/caesar.entity'
import { Bank } from 'src/cash-transfer/entities/bank.entity'
import { CashTransfer } from 'src/cash-transfer/entities/cash-transfer.entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm'

@Unique(['description'])
@Index(['description'])
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

  @Column({
    default: 0,
  })
  balance: number

  @CreateDateColumn({
    type: 'datetime',
  })
  created_at: Date

  @UpdateDateColumn({
    type: 'datetime',
  })
  updated_at: Date
}
