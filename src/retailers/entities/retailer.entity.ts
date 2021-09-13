import { Expose } from 'class-transformer'
import { Dsp } from 'src/dsp/entities/dsp.entity'
import { Subdistributor } from 'src/subdistributor/entities/subdistributor.entity'
import { User } from 'src/user/entities/user.entity'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class Retailer {
  @PrimaryGeneratedColumn('uuid')
  id: string
  @Expose()
  @ManyToOne((type) => Subdistributor, (subd) => subd.retailers)
  subdistributor: Subdistributor

  @Expose()
  @ManyToOne((type) => Dsp, (dsp) => dsp.retailers)
  dsp: Dsp

  @Expose()
  @OneToOne((type) => User, (user) => user.retailer, {
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  user: User

  @Column()
  e_bind_number: string

  @Column({ default: `` })
  store_name: string

  @Column()
  id_type: string

  @Column()
  id_number: string
}
