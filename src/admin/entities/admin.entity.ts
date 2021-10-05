import { User } from 'src/user/entities/user.entity'
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class Admin {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    nullable: false,
  })
  name: string

  @OneToOne(() => User, (user) => user.admin, {
    nullable: false,
  })
  @JoinColumn({
    name: 'user_id',
  })
  user: User
}
