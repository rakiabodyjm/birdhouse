import { Exclude, Expose } from 'class-transformer'
import { Admin } from 'src/admin/entities/admin.entity'
import { Caesar } from 'src/caesar/entities/caesar.entity'
import { Dsp } from 'src/dsp/entities/dsp.entity'
import { Retailer } from 'src/retailers/entities/retailer.entity'
import { Subdistributor } from 'src/subdistributor/entities/subdistributor.entity'
import { RolesArray } from 'src/types/Roles'
import { SQLDateGenerator } from 'src/utils/SQLDateGenerator'
import {
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
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

  @Column()
  address1: string

  @Column({
    default: null,
  })
  address2: string

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

  // @Column({
  //   type: 'datetime',
  //   // default: 'CURRENT_TIMESTAMP',
  //   default: new SQLDateGenerator().timeNow().getSQLDate(),
  // })
  @CreateDateColumn({
    type: 'datetime',
  })
  created_at: Date

  // @Column({
  //   type: 'datetime',
  //   default: new SQLDateGenerator().timeNow().getSQLDate(),
  //   // default: 'CURRENT_TIMESTAMP',
  //   // nullable: false,
  // })
  @UpdateDateColumn({
    type: 'datetime',
  })
  updated_at: Date | string

  @Expose()
  roles?() {
    const roles = ['user']
    RolesArray.forEach((ea) => {
      if (this[ea]) {
        roles.push(ea)
      }
    })

    return roles
  }

  /**
   * Relationships
   */
  @OneToOne((type) => Retailer, (retailer) => retailer.user, {
    eager: true,
    cascade: true,
  })
  retailer?: Retailer

  @OneToOne(() => Dsp, (dsp) => dsp.user, {
    /**
     * "cascade" ensures changes to user entity will affect the other one
     */
    cascade: true,
    /**
     * "eager" loads relationship so we don't have to specify relationship on find
     */
    eager: true,

    // createForeignKeyConstraints: false,
  })
  dsp?: Dsp

  @OneToOne(() => Admin, (admin) => admin.user, {
    /**
     * "cascade" ensures changes to user entity will affect the other one
     */
    // cascade: true,

    /**
     * "eager" loads relationship so we don't have to specify relationship on find
     */
    eager: true,
  })
  admin?: Admin

  @OneToOne(() => Subdistributor, (subd) => subd.user, {
    eager: true,
    cascade: true,
  })
  subdistributor?: Subdistributor

  @OneToOne(() => Caesar, (caesar) => caesar.user, {
    eager: true,
  })
  caesar_wallet?: Caesar

  @BeforeUpdate()
  setUpdatedAt() {
    this.updated_at = new SQLDateGenerator().timeNow().getSQLDate()
  }

  @Column({
    default: null,
  })
  custom_roles: string
}
