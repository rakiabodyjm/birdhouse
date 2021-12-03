import { InventoryLog } from 'src/inventory/entities/inventory-logs.entity'
import Inventory from 'src/inventory/entities/inventory.entity'
import { Transaction } from 'src/transaction/entities/transaction.entity'
import { UserTypesAndUser } from 'src/types/Roles'
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity()
@Index(['id', 'account_id', 'ceasar_id'])
export class Ceasar {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({})
  account_type: UserTypesAndUser

  @Column({})
  account_id: string

  @Column()
  ceasar_id: string

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

  @OneToMany((type) => Inventory, (inventory) => inventory.ceasar)
  inventory: Inventory[]

  @OneToMany((type) => Transaction, (transaction) => transaction.buyer)
  transactions: Transaction[]

  @OneToMany(() => InventoryLog, (inventoryLog) => inventoryLog.ceasar)
  inventory_logs: InventoryLog[]
}
