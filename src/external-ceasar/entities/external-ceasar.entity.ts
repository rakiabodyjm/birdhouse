import { UserTypes, UserTypesAndUser } from 'src/types/Roles'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class ExternalCeasar {
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

  @Column()
  ceasar_coin: number

  @Column({
    nullable: true,
  })
  dollar: number

  @Column({
    nullable: true,
  })
  peso: number
}
