import { Caesar } from 'src/caesar/entities/caesar.entity'
import { Dsp } from 'src/dsp/entities/dsp.entity'
import { MapId } from 'src/map-ids/entities/map-id.entity'
import { Retailer } from 'src/retailers/entities/retailer.entity'
import { User } from 'src/user/entities/user.entity'
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class Subdistributor {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    nullable: false,
  })
  name: string

  @Column()
  e_bind_number: string

  @Column({})
  id_number: string

  @Column({})
  id_type: string

  @Column()
  zip_code: string

  // @Column({
  //   type: 'date',
  // })
  // birthdate: Date

  owner_first_name() {
    return this.user.first_name
  }

  owner_last_name() {
    return this.user.last_name
  }

  owner_name() {
    return this.user ? `${this.user.first_name} ${this.user.last_name}` : null
  }

  @JoinColumn({
    name: 'user_id',
  })
  @OneToOne((type) => User, (user) => user.subdistributor, {
    nullable: false,
  })
  user: User

  @OneToOne((type) => MapId, (mapid) => mapid.subdistributor, {
    nullable: false,
    eager: true,
  })
  @JoinColumn({
    name: 'area_id',
  })
  area_id: MapId

  @OneToMany((type) => Dsp, (dsp) => dsp.subdistributor, {
    nullable: true,
  })
  dsp?: Dsp[]

  @OneToMany((type) => Retailer, (retailer) => retailer.subdistributor, {
    nullable: true,
  })
  retailer?: Retailer[]

  retailer_total: number
  dsp_total: number
  // dsp_total: number

  // @OneToOne((type) => Caesar, (caesar) => caesar.subdistributor)
  caesar_wallet?: Caesar
}
