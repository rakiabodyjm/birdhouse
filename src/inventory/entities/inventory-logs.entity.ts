import { RequestMethod } from '@nestjs/common'
import { Ceasar } from 'src/ceasar/entities/ceasar.entity'
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
    name: 'ceasar_id',
  })
  // @ManyToOne((type) => Ceasar, (ceasar) => ceasar.inventory_logs)
  // ceasar: Ceasar
  @Column()
  remarks: string

  @CreateDateColumn()
  craeted_at: Date
}
