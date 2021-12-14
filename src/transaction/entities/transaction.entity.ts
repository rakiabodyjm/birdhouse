import { Caesar } from 'src/caesar/entities/caesar.entity'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('increment')
  id: string

  @JoinColumn({
    name: 'buyer_caesar_id',
  })
  @ManyToOne((type) => Caesar, (caesar) => caesar.transactions)
  buyer: Caesar

  @JoinColumn({
    name: 'seller_caesar_id',
  })
  @ManyToOne((type) => Caesar, (caesar) => caesar.transactions)
  seller: Caesar

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 4,
  })
  quantity: number

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 4,
  })
  unit_price: number

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 4,
  })
  srp: number

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 4,
  })
  cost_price: number

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 4,
  })
  sales_price: number

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 4,
  })
  profit: number
}
