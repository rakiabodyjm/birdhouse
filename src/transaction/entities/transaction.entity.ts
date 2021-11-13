import { Ceasar } from 'src/ceasar/entities/ceasar.entity'
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
    name: 'buyer_ceasar_id',
  })
  @ManyToOne((type) => Ceasar, (ceasar) => ceasar.transactions)
  buyer: Ceasar

  @JoinColumn({
    name: 'seller_ceasar_id',
  })
  @ManyToOne((type) => Ceasar, (ceasar) => ceasar.transactions)
  seller: Ceasar

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
