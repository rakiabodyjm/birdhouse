import { CaesarService } from 'src/caesar/caesar.service'
import { Caesar } from 'src/caesar/entities/caesar.entity'
import Inventory from 'src/inventory/entities/inventory.entity'
import { Transaction } from 'src/transaction/entities/transaction.entity'
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
@Index(<(keyof PendingTransaction)[]>['id', 'pending_purchase_id'])
export class PendingTransaction {
  @PrimaryGeneratedColumn('increment')
  id: string

  @Column()
  pending_purchase_id: string

  @Column({
    default: false,
  })
  approved: boolean

  @ManyToOne((type) => Inventory, (inventory) => inventory.pending_transactions)
  @JoinColumn({
    name: 'inventory_to_be_bought',
  })
  inventory: Inventory

  @ManyToOne(
    (type) => Caesar,
    (caesar) => caesar.pending_transactions_as_buyer,
    {
      eager: true,
    },
  )
  @JoinColumn({
    name: 'buyer_caesar',
  })
  caesar_buyer: Caesar

  @ManyToOne(
    (type) => Caesar,
    (ceasar) => ceasar.pending_transactions_as_seller,
    {
      eager: true,
    },
  )
  @JoinColumn({
    name: 'caesar_seller',
  })
  caesar_seller: Caesar

  @Column()
  quantity: number

  @JoinColumn({
    name: 'transaction_id',
  })
  @ManyToOne(
    () => Transaction,
    (transaction) => transaction.pending_transaction,
  )
  transaction_id?: Transaction

  @CreateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date

  @UpdateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated_at: Date

  @DeleteDateColumn({
    type: 'datetime',
  })
  deleted_at: Date
}
