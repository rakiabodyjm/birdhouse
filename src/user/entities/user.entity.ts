import { Exclude, Expose } from 'class-transformer'
import { Admin } from 'src/admin/entities/admin.entity'
import { Dsp } from 'src/dsp/entities/dsp.entity'
import { SQLDateGenerator } from 'src/utils/SQLDateGenerator'
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

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

  @Exclude()
  @Column({ default: true })
  active: boolean

  @Column({ unique: true })
  email: string

  @Column({ unique: true })
  username: string

  @Column({})
  @Exclude()
  password: string

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

  @OneToOne(() => Dsp, (dsp) => dsp.user, {
    /**
     * "ensures" changes to user entity will affect the other one
     */
    cascade: true,
    createForeignKeyConstraints: false,
    onDelete: 'CASCADE',
  })
  dsp: Dsp

  @OneToOne(() => Admin, (admin) => admin.user, {
    cascade: true,
    createForeignKeyConstraints: false,
    onDelete: 'CASCADE',
  })
  admin?: Admin
}
