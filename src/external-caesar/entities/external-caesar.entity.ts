import { UserTypes, UserTypesAndUser } from 'src/types/Roles'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

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

  @Column('decimal', {
    nullable: true,
    precision: 18,
    scale: 2,
  })
  dollar: number

  @Column('decimal', {
    nullable: true,
    precision: 18,
    scale: 2,
  })
  peso: number
}
