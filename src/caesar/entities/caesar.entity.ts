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
@Index(['id', 'account_id', 'caesar_id'])
export class Caesar {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({})
  account_type: UserTypesAndUser

  @Column({})
  account_id: string

  @Column({
    default: null,
  })
  caesar_id: string

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

  @OneToMany((type) => Inventory, (inventory) => inventory.caesar)
  inventory: Inventory[]

  @OneToMany((type) => Transaction, (transaction) => transaction.buyer)
  transactions: Transaction[]
  // @JoinColumn({
  //   name: 'user_account',
  // })
  // @OneToOne(() => User, (user) => user.caesar_wallet, {
  //   nullable: true,
  // })
  // user?: User

  // @JoinColumn({
  //   name: 'subdistributor_account',
  // })
  // @OneToOne(() => Subdistributor, (subd) => subd.caesar_wallet, {
  //   nullable: true,
  // })
  // subdistributor?: Subdistributor

  // @JoinColumn({
  //   name: 'dsp_account',
  // })
  // @OneToOne(() => Dsp, (dsp) => dsp.caesar_wallet, {
  //   nullable: true,
  // })
  // dsp?: Dsp

  // @JoinColumn({
  //   name: 'retailer_account',
  // })
  // @OneToOne(() => Retailer, (retailer) => retailer.caesar_wallet, {
  //   nullable: true,
  // })
  // retailer?: Retailer

  // @JoinColumn({
  //   name: 'admin_account',
  // })
  // @OneToOne(() => Admin, (admin) => admin.caesar_wallet, {
  //   nullable: true,
  // })
  // admin?: Admin
}
