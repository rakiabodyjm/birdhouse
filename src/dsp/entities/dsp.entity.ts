import { MapId } from 'src/map-ids/entities/map-id.entity'
import { User } from 'src/user/entities/user.entity'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class Dsp {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({})
  dsp_code: string

  @OneToOne(() => User, (user) => user.dsp, {
    // cascade: true,
    createForeignKeyConstraints: false,
  })
  @JoinColumn()
  user: User

  @JoinColumn()
  @ManyToOne(() => MapId, (mapid) => mapid.dsp, {})
  area_id: MapId

  @Column({
    nullable: true,
  })
  e_bind_number: string
}
