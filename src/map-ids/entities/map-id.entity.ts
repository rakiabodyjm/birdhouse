import { Dsp } from 'src/dsp/entities/dsp.entity'
import { Subdistributor } from 'src/subdistributor/entities/subdistributor.entity'
import { Column, Entity, Index, OneToMany } from 'typeorm'

@Entity()
@Index([
  'area_name',
  'area_id',
  'area_parent_pp_name',
  'parent_name',
  'parent_parent_name',
])
export class MapId {
  // @PrimaryGeneratedColumn('increment')
  // id!: string

  @Column({
    primary: true,
  })
  area_id: string

  @Column()
  area_name: string

  @Column()
  parent_name!: string

  @Column()
  parent_parent_name!: string

  @Column()
  area_parent_pp_name!: string

  @OneToMany(() => Dsp, (dsp) => dsp.area_id, {
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false,
  })
  dsp?: Dsp[]

  @OneToMany((type) => Subdistributor, (subd) => subd.map_id)
  subdistributors: Subdistributor[]
}
