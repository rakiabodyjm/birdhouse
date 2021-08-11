import { Dsp } from 'src/dsp/entities/dsp.entity'
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class MapId {
  // @PrimaryGeneratedColumn('increment')
  // id!: string

  @Column({
    primary: true,
  })
  area_id: string

  @Column({ nullable: false, type: 'nvarchar' })
  area_name: string

  @Column({ nullable: false, type: 'nvarchar' })
  parent_name!: string

  @Column({ nullable: false, type: 'nvarchar' })
  parent_parent_name!: string

  @Column({ nullable: false, type: 'nvarchar' })
  area_parent_pp_name!: string

  @OneToMany(() => Dsp, (dsp) => dsp.area_id, {
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false,
  })
  dsp?: Dsp[]
}
