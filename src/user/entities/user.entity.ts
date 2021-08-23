import { Exclude, Expose, Transform } from 'class-transformer'
import { Admin } from 'src/admin/entities/admin.entity'
import { Dsp } from 'src/dsp/entities/dsp.entity'
import { Roles, RolesArray } from 'src/types/Roles'
import { Bcrypt } from 'src/utils/Bcrypt'
import { SQLDateGenerator } from 'src/utils/SQLDateGenerator'
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
@Index(['first_name', 'last_name', 'phone_number', 'email', 'username'])
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

  @Column()
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
     * "cascade" ensures changes to user entity will affect the other one
     */
    // cascade: true,
    createForeignKeyConstraints: false,
    onDelete: 'CASCADE',
    /**
     * "eager" loads relationship so we don't have to specify relationship on find
     */
    eager: true,
  })
  dsp: Dsp

  @OneToOne(() => Admin, (admin) => admin.user, {
    /**
     * "cascade" ensures changes to user entity will affect the other one
     */
    // cascade: true,

    /**
     * "eager" loads relationship so we don't have to specify relationship on find
     */

    eager: true,
    createForeignKeyConstraints: false,
    onDelete: 'CASCADE',
  })
  admin: Admin

  @Expose()
  roles?() {
    const roles = []
    RolesArray.forEach((ea) => {
      if (this[ea]) {
        roles.push(ea)
      }
    })

    return roles
  }
}
