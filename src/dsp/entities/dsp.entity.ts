import { Ceasar } from 'src/ceasar/entities/ceasar.entity'
import { MapId } from 'src/map-ids/entities/map-id.entity'
import { Retailer } from 'src/retailers/entities/retailer.entity'
import { Subdistributor } from 'src/subdistributor/entities/subdistributor.entity'
import { User } from 'src/user/entities/user.entity'
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
@Index(['dsp_code', 'e_bind_number'])
export class Dsp {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({})
  dsp_code: string

  @OneToOne(() => User, (user) => user.dsp, {
    nullable: false,
  })
  @JoinColumn({
    name: 'user_id',
  })
  user: User

  @ManyToMany(() => MapId, (mapid) => mapid.dsp, {
    cascade: true,
    nullable: true,
    eager: true,
  })
  @JoinTable({
    name: 'dsp_area_id',
    joinColumn: {
      name: 'dsp_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'area_id',
      referencedColumnName: 'area_id',
    },
  })
  area_id: MapId[]

  @Column()
  e_bind_number: string

  @ManyToOne((type) => Subdistributor, (subd) => subd.dsp, {
    nullable: false,
  })
  @JoinColumn({
    name: 'subdistributor_id',
  })
  subdistributor: Subdistributor

  @OneToMany((type) => Retailer, (retailer) => retailer.dsp, {
    onDelete: 'SET NULL',
  })
  retailer?: Retailer[]

  ceasar_wallet?: Ceasar
}
