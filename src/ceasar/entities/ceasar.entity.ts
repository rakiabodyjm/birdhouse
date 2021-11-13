import { ExternalCeasar } from 'src/external-ceasar/entities/external-ceasar.entity'
import Inventory from 'src/inventory/entities/inventory.entity'
import { Transaction } from 'src/transaction/entities/transaction.entity'
import { UserTypesAndUser } from 'src/types/Roles'
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  OneToOne,
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

  data?: ExternalCeasar

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

  @OneToOne((type) => Inventory, (inventory) => inventory.ceasar)
  inventory: Inventory

  @OneToMany((type) => Transaction, (transaction) => transaction.buyer)
  transactions: Transaction[]
  // @JoinColumn({
  //   name: 'user_account',
  // })
  // @OneToOne(() => User, (user) => user.ceasar_wallet, {
  //   nullable: true,
  // })
  // user?: User

  // @JoinColumn({
  //   name: 'subdistributor_account',
  // })
  // @OneToOne(() => Subdistributor, (subd) => subd.ceasar_wallet, {
  //   nullable: true,
  // })
  // subdistributor?: Subdistributor

  // @JoinColumn({
  //   name: 'dsp_account',
  // })
  // @OneToOne(() => Dsp, (dsp) => dsp.ceasar_wallet, {
  //   nullable: true,
  // })
  // dsp?: Dsp

  // @JoinColumn({
  //   name: 'retailer_account',
  // })
  // @OneToOne(() => Retailer, (retailer) => retailer.ceasar_wallet, {
  //   nullable: true,
  // })
  // retailer?: Retailer

  // @JoinColumn({
  //   name: 'admin_account',
  // })
  // @OneToOne(() => Admin, (admin) => admin.ceasar_wallet, {
  //   nullable: true,
  // })
  // admin?: Admin
}
