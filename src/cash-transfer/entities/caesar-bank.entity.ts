import { Caesar } from 'src/caesar/entities/caesar.entity'
import { Bank } from 'src/cash-transfer/entities/bank.entity'
import { CashTransfer } from 'src/cash-transfer/entities/cash-transfer.entity'
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class CaesarBank {
  @PrimaryGeneratedColumn('increment')
  id: number

  @ManyToOne((type) => Caesar, (caesar) => caesar.bank_accounts)
  caesar: Caesar

  @ManyToMany((type) => Bank, (bank) => bank.caesar_bank, {
    onDelete: 'RESTRICT',
  })
  bank: Bank[]

  @Column({
    type: 'text',
    nullable: true,
  })
  description?: string

  @OneToMany((type) => CashTransfer, (cashTransfer) => cashTransfer.caesar_bank)
  cash_transfer: CashTransfer[]
}
