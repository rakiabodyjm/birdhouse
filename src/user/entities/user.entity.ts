import { SQLDateGenerator } from 'src/utils/SQLDateGenerator'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  first_name: string

  @Column()
  last_name: string

  @Column()
  phone_number: string

  @Column({ default: true })
  active: boolean

  @Column({
    type: 'datetime',
    default: new SQLDateGenerator().timeNow().getSQLDate(),
  })
  created_at: Date

  @Column({
    type: 'datetime',
    default: new SQLDateGenerator().timeNow().getSQLDate(),
    nullable: false,
  })
  updated_at: Date
}
