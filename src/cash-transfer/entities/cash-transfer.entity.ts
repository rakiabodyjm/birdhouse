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

@Entity()
export class CashTransfer {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne((type) => CaesarBank, (caesarBank) => caesarBank.cash_transfer)
  caesar_bank: CaesarBank

  @ManyToOne(
    (type) => TransferType,
    (transferType) => transferType.cash_transfer,
  )
  transfer_type: TransferType

  @Column()
  amount: number

  @ManyToOne((type) => Caesar, (caesar) => caesar.cash_transfer_from)
  from: Caesar

  @ManyToOne((type) => Caesar, (caesar) => caesar.cash_transfer_to)
  to: Caesar

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
