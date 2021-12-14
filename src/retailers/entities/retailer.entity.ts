import { Expose } from 'class-transformer'
import { Caesar } from 'src/caesar/entities/caesar.entity'
import { Dsp } from 'src/dsp/entities/dsp.entity'
import { Subdistributor } from 'src/subdistributor/entities/subdistributor.entity'
import { User } from 'src/user/entities/user.entity'
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
@Index(['id', 'store_name', 'e_bind_number', 'id_number'])
export class Retailer {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @JoinColumn({
    name: 'subdistributor_id',
  })
  @Expose()
  @ManyToOne((type) => Subdistributor, (subd) => subd.retailer, {
    onDelete: 'SET NULL',
    // eager: true,
  })
  subdistributor: Subdistributor

  @Expose()
  @ManyToOne((type) => Dsp, (dsp) => dsp.retailer, {
    onDelete: 'SET NULL',
    // eager: true,
  })
  @JoinColumn({
    name: 'dsp_id',
  })
  dsp?: Dsp

  @Expose()
  @OneToOne((type) => User, (user) => user.retailer, {
    nullable: false,
  })
  @JoinColumn({
    name: 'user_id',
  })
  user: User

  @Column()
  e_bind_number: string

  @Column({ default: `` })
  store_name: string

  @Column()
  id_type: string

  @Column()
  id_number: string

  // @OneToOne(() => Caesar, (caesar) => caesar.retailer)
  caesar_wallet?: Caesar
}
