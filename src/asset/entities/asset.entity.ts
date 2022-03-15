import { Exclude, Expose, Transform } from 'class-transformer'
import Inventory from 'src/inventory/entities/inventory.entity'
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity()
// @Index(['id', 'code', 'description', 'active'])
@Index(['code', 'description', 'active'])
export default class Asset {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    unique: true,
  })
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

  @CreateDateColumn({
    type: 'datetime',
  })
  created_at: Date

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

  /**
   * [retailer, dsp, subdistributor ]
   * [subd]
   * [retailer]
   * [dsp, retailer]
   */
  @Column({
    default: null,
  })
  approval?: string

  @Column({
    default: false,
  })
  whole_number_only: boolean
}
