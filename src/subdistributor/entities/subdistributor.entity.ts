import { Expose } from 'class-transformer'
import { Dsp } from 'src/dsp/entities/dsp.entity'
import { MapId } from 'src/map-ids/entities/map-id.entity'
import { Retailer } from 'src/retailers/entities/retailer.entity'
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
export class Subdistributor {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  e_bind_number: string

  @JoinColumn()
  @OneToOne((type) => User, (user) => user.subdistributor, {
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  user?: User

  @Column()
  id_number: string

  @OneToMany((type) => Dsp, (dsp) => dsp.subdistributor)
  dsp?: Dsp[]

  @OneToMany((type) => Retailer, (retailer) => retailer.subdistributor)
  @JoinColumn()
  retailers: Retailer[]

  @ManyToOne((type) => MapId, (mapid) => mapid.subdistributors)
  map_id: MapId

  @Column()
  zip_code: string

  owner_first_name() {
    return this.user.first_name
  }

  owner_last_name() {
    return this.user.last_name
  }

  @Expose()
  owner_name() {
    return this.user ? `${this.user.first_name} ${this.user.last_name}` : null
  }
}
