import { CashTransfer } from './cash-transfer.entity'
import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class RevertCashTransfer {
  @PrimaryGeneratedColumn('increment')
  id: number

  @OneToOne(() => CashTransfer, (ct) => ct.revert_cash_transfer)
  cash_transfer: CashTransfer

  @CreateDateColumn({
    type: 'datetime',
  })
  created_at: Date

  @DeleteDateColumn({
    type: 'datetime',
  })
  deleted_at: Date
}
