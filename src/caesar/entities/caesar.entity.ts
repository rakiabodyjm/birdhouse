import { Expose } from 'class-transformer'
import { Admin } from 'src/admin/entities/admin.entity'
import { Dsp } from 'src/dsp/entities/dsp.entity'
import { ExternalCaesar } from 'src/external-caesar/entities/external-caesar.entity'
import { InventoryLog } from 'src/inventorylog/entities/inventory-logs.entity'
import Inventory from 'src/inventory/entities/inventory.entity'
import { Retailer } from 'src/retailers/entities/retailer.entity'
import { Subdistributor } from 'src/subdistributor/entities/subdistributor.entity'
import { PendingTransaction } from 'src/transaction/entities/pending-transaction.entity'
import { Transaction } from 'src/transaction/entities/transaction.entity'
import { Roles, UserTypesAndUser } from 'src/types/Roles'
import { User } from 'src/user/entities/user.entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { CaesarBank } from 'src/cash-transfer/entities/caesar-bank.entity'
import { CashTransfer } from 'src/cash-transfer/entities/cash-transfer.entity'

class WithAccountTypes {
  @JoinColumn({
    name: 'user_account',
  })
  @OneToOne(() => User, (user) => user.caesar_wallet, {
    nullable: true,
    createForeignKeyConstraints: false,
    onDelete: 'SET NULL',
  })
  user?: User

  @JoinColumn({
    name: 'subdistributor_account',
  })
  @OneToOne(() => Subdistributor, (subd) => subd.caesar_wallet, {
    nullable: true,
  })
  subdistributor?: Subdistributor

  @JoinColumn({
    name: 'dsp_account',
  })
  @OneToOne(() => Dsp, (dsp) => dsp.caesar_wallet, {
    nullable: true,
  })
  dsp?: Dsp

  @JoinColumn({
    name: 'retailer_account',
  })
  @OneToOne(() => Retailer, (retailer) => retailer.caesar_wallet, {
    nullable: true,
  })
  retailer?: Retailer

  @JoinColumn({
    name: 'admin_account',
  })
  @OneToOne(() => Admin, (admin) => admin.caesar_wallet, {
    nullable: true,
  })
  admin?: Admin
}

@Entity()
@Index(['id', 'caesar_id', ...Object.values(Roles), 'user'])
export class Caesar extends WithAccountTypes {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({})
  account_type: UserTypesAndUser

  @Expose()
  account_id() {
    const account_id = [
      this.subdistributor,
      this.retailer,
      this.dsp,
      this.user,
      this.admin,
    ].reduce((acc, ea) => {
      if (ea && ea.id) {
        return ea.id
      } else {
        return acc
      }
    }, this.id)
    return account_id
  }

  @Column()
  caesar_id: string

  @Expose()
  description() {
    if (this.subdistributor) {
      return this.subdistributor.name
    }
    if (this.retailer) {
      return this.retailer.store_name
    }
    if (this.dsp) {
      return this.dsp.dsp_code
    }
    if (this.user) {
      return `${this.user.first_name} ${this.user.last_name}`
    }
    if (this.admin) {
      return `${this.admin.name}`
    }
    return this.id
  }

  @OneToMany((type) => InventoryLog, (inventoryLog) => inventoryLog.caesar)
  inventoryLogs: InventoryLog[]

  @OneToMany((type) => Inventory, (inventory) => inventory.caesar, {
    createForeignKeyConstraints: true,
  })
  inventory: Inventory[]

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

  @OneToMany(() => Transaction, (transaction) => transaction.buying_account)
  buy_transactions: Transaction[]

  @OneToMany(() => Transaction, (transaction) => transaction.seller)
  sell_transactions: Transaction[]

  @OneToMany(
    (type) => PendingTransaction,
    (pending_transaction) => pending_transaction.caesar_buyer,
  )
  pending_transactions_as_buyer: PendingTransaction[]

  @OneToMany(
    (type) => PendingTransaction,
    (pending_transaction) => pending_transaction.caesar_seller,
  )
  pending_transactions_as_seller: PendingTransaction[]

  @Expose()
  data?: ExternalCaesar

  @OneToMany((type) => CaesarBank, (caesarBank) => caesarBank.caesar)
  bank_accounts: CaesarBank[]

  @OneToMany((type) => CashTransfer, (cashTransfer) => cashTransfer.from)
  cash_transfer_from: CashTransfer[]

  @OneToMany((type) => CashTransfer, (cashTransfer) => cashTransfer.to)
  cash_transfer_to: CashTransfer[]

  @Column({
    default: 0,
  })
  cash_transfer_balance: number

  @Column({
    default: false,
  })
  has_loan: boolean
}
