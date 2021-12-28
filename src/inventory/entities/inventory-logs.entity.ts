import { Caesar } from 'src/caesar/entities/caesar.entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class InventoryLog {
  @PrimaryGeneratedColumn('increment')
  id: string

  @Column()
  method: string

  @Column()
  data: string

  // @Column()
  // response: string

  @Column()
  remarks: string

  @JoinColumn({
    name: 'caesar_id',
  })
  @ManyToOne((type) => Caesar, (caesar) => caesar.inventoryLogs, {
    eager: true,
  })
  caesar: Caesar

  @CreateDateColumn()
  created_at: Date
}
