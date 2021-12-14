import { RequestMethod } from '@nestjs/common'
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
  method: RequestMethod

  @Column()
  data: string

  @JoinColumn({
    name: 'caesar_id',
  })
  // @ManyToOne((type) => Caesar, (caesar) => caesar.inventory_logs)
  // caesar: Caesar
  @Column()
  remarks: string

  @CreateDateColumn()
  craeted_at: Date
}
