import Inventory from 'src/inventory/entities/inventory.entity'
import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity()
@Index(['id', 'code', 'description', 'active'])
export default class Asset {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  code: string

  @Column()
  name: string

  @Column()
  description: string

  @Column('decimal', {
    precision: 18,
    scale: 4,
  })
  unit_price: number

  @Column('decimal', {
    precision: 18,
    scale: 4,
  })
  srp_for_subd: number

  @Column('decimal', {
    precision: 18,
    scale: 4,
  })
  srp_for_dsp: number

  @Column('decimal', {
    precision: 18,
    scale: 4,
  })
  srp_for_retailer: number

  @Column('decimal', {
    precision: 18,
    scale: 4,
  })
  srp_for_user: number

  @Column()
  active: boolean

  @UpdateDateColumn({
    type: 'datetime',
  })
  updated_at: Date

  @DeleteDateColumn({
    type: 'datetime',
  })
  deleted_at: Date

  @OneToMany((type) => Inventory, (inventory) => inventory.asset)
  inventory: Inventory[]
}
