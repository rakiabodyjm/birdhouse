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
    nullable: true,
  })
  name: string

  @OneToOne(() => User, (user) => user.admin, {
    createForeignKeyConstraints: true,
  })
  @JoinColumn()
  user?: User
}
