import { CaesarBank } from 'src/cash-transfer/entities/caesar-bank.entity'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Bank {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column()
  name: string

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string

  @OneToMany((type) => CaesarBank, (caesarBank) => caesarBank.bank)
  caesar_bank: CaesarBank[]
}
