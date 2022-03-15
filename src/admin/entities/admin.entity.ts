import { Caesar } from 'src/caesar/entities/caesar.entity'
import { User } from 'src/user/entities/user.entity'
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
// @Index(['id'])
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

  @OneToOne(() => Caesar, (caesar) => caesar.admin, {})
  caesar_wallet?: Caesar
}
