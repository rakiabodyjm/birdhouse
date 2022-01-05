import { Caesar } from 'src/caesar/entities/caesar.entity'
import Inventory from 'src/inventory/entities/inventory.entity'
import { PendingTransaction } from 'src/transaction/entities/pending-transaction.entity'
import { UserTypesAndUser } from 'src/types/Roles'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('increment')
  id: string

  @JoinColumn({
    name: 'inventory_from_id',
  })
  @ManyToOne(() => Inventory, (inventory) => inventory.from_transactions)
  inventory_from: Inventory

  @JoinColumn({
    name: 'inventory_to_id',
  })
  @ManyToOne(() => Inventory, (inventory) => inventory.to_transactions)
  inventory_to: Inventory

  @JoinColumn({
    name: 'seller_caesar_id',
  })
  @ManyToOne(() => Caesar, (caesar) => caesar.sell_transactions)
  seller: Caesar

  @JoinColumn({
    name: 'buyer_caesar_id',
  })
  @ManyToOne(() => Caesar, (caesar) => caesar.buy_transactions)
  buyer: Caesar

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 4,
  })
  unit_price: number

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 4,
  })
  selling_price: number

  @Column()
  buying_account: UserTypesAndUser

  @Column()
  selling_account: UserTypesAndUser

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 4,
  })
  quantity: number

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 4,
  })
  cost_price: number

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 4,
  })
  sales_price: number

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 4,
  })
  seller_profit: number

  // @Column({
  //   default: null,
  // })
  // approval_subdistributor: string

  // @Column({
  //   default: null,
  // })
  // approval_dsp: string

  // @Column({
  //   default: null,
  // })
  // approval_retailer: string

  @OneToMany(
    (type) => PendingTransaction,
    (pendingTransaction) => pendingTransaction.transaction_id,
  )
  pending_transaction?: PendingTransaction[]

  @Column({
    default: null,
    unique: true,
  })
  pending_purchase_id: string

  @CreateDateColumn({
    type: 'datetime',
  })
  created_at: Date

  @UpdateDateColumn({
    type: 'datetime',
  })
  updated_at: Date

  // @OneToMany(
  //   (type) => PendingTransaction,
  //   (pendingTransaction) => pendingTransaction.transaction,
  // )
  // pending_transaction: PendingTransaction[]
}

/**
 * Order is important
 * descending hierarchy
 */
export const transactionAccountApprovals = [
  'admin',
  'subdistributor',
  'dsp',
  'retailer',
] as UserTypesAndUser[]
