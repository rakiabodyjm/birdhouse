import { User } from 'src/user/entities/user.entity'
import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Admin {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @OneToOne(() => User, (user) => user.admin, {
    createForeignKeyConstraints: true,
  })
  @JoinColumn()
  user?: User
}
