import { Caesar } from 'src/caesar/entities/caesar.entity'
import Inventory from 'src/inventory/entities/inventory.entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity({
  name: 'inventory_logs',
})
export class InventoryLog {
  @PrimaryGeneratedColumn('increment')
  id: string

  @Column()
  method: string

  @Column({
    type: 'varchar',
    length: 'MAX',
    nullable: false,
  })
  data: string

  @Column()
  remarks: string

  @JoinColumn({
    name: 'caesar_account',
  })
  @ManyToOne((type) => Caesar, (caesar) => caesar.inventoryLogs, {
    eager: true,
  })
  caesar: Caesar

  @CreateDateColumn()
  created_at: Date
}

export type InventoryLogData = {
  id: string
  name: string
  description: string
  created: Inventory
  updated: Partial<Inventory>
}
