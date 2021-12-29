import Asset from 'src/asset/entities/asset.entity'
import { Caesar } from 'src/caesar/entities/caesar.entity'
import { PendingTransaction } from 'src/transaction/entities/pending-transaction.entity'
import { Transaction } from 'src/transaction/entities/transaction.entity'
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm'

@Entity()
@Unique(['asset', 'caesar'])
export default class Inventory {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  quantity: number

  @JoinColumn({
    name: 'asset_id',
  })
  @ManyToOne((type) => Asset, (asset) => asset.inventory)
  asset: Asset

  @JoinColumn({
    name: 'caesar_id',
  })
  @ManyToOne((type) => Caesar, (caesar) => caesar.inventory, {
    createForeignKeyConstraints: false,
    nullable: false,
  })
  caesar: Caesar

  @Column({
    default: '',
  })
  name: string

  @Column({
    nullable: true,
  })
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

  @OneToMany(() => Transaction, (transaction) => transaction.inventory_from)
  from_transactions?: Transaction[]

  @OneToMany(() => Transaction, (transactions) => transactions.inventory_to)
  to_transactions?: Transaction[]

  @OneToMany(
    () => PendingTransaction,
    (pendingTranscations) => pendingTranscations.inventory,
  )
  pending_transactions: PendingTransaction[]

  @Column({
    default: true,
  })
  active: boolean

  /**
   * JSON Data
   */
  @Column({
    nullable: true,
  })
  restrictions: string

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
}
