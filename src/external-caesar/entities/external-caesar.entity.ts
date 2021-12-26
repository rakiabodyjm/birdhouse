import { Expose } from 'class-transformer'
import { UserTypes, UserTypesAndUser } from 'src/types/Roles'
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

const dollarExchangeRate = process.env.USD_EXCHANGE_RATE || 49
const pesoExchangeRate = process.env.PESO_EXCHANGE_RATE || 1

@Entity()
export class ExternalCaesar {
  @PrimaryGeneratedColumn('increment')
  wallet_id: string

  @Column()
  last_name: string

  @Column()
  first_name: string

  @Column()
  cp_number: string

  @Column()
  email: string

  @Column()
  role: UserTypesAndUser

  @Column('decimal', {
    precision: 18,
    scale: 2,
  })
  caesar_coin: number

  // @Column('decimal', {
  //   nullable: true,
  //   precision: 18,
  //   scale: 2,
  // })
  @Expose()
  dollar(): number {
    const conversion = this.caesar_coin / Number(dollarExchangeRate)
    return Number(conversion.toFixed(2))
  }

  // @Column('decimal', {
  //   nullable: true,
  //   precision: 18,
  //   scale: 2,
  // })
  @Expose()
  peso(): number {
    const conversion = this.caesar_coin * Number(pesoExchangeRate)
    return Number(conversion.toFixed(2))
  }

  @UpdateDateColumn({
    type: 'datetime',
  })
  updated_at: Date

  @CreateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date
}
