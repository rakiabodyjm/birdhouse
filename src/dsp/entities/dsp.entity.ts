import { MapId } from 'src/map-ids/entities/map-id.entity'
import { Retailer } from 'src/retailers/entities/retailer.entity'
import { Subdistributor } from 'src/subdistributor/entities/subdistributor.entity'
import { User } from 'src/user/entities/user.entity'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class Dsp {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({})
  dsp_code: string

  @OneToOne(() => User, (user) => user.dsp, {
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  user?: User

  @JoinColumn()
  @ManyToOne(() => MapId, (mapid) => mapid.dsp, {})
  area_id: MapId

  @Column({
    nullable: true,
  })
  e_bind_number: string

  @ManyToOne((type) => Subdistributor, (subd) => subd.dsp)
  subdistributor: Subdistributor

  @OneToMany((type) => Retailer, (retailer) => retailer.dsp)
  retailers: Retailer[]
}
