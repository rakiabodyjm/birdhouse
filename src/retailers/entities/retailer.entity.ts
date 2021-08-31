import { Dsp } from 'src/dsp/entities/dsp.entity'
import { Subdistributor } from 'src/subdistributor/entities/subdistributor.entity'
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Retailer {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne((type) => Subdistributor, (subd) => subd.retailers)
  subdistributor: Subdistributor

  @ManyToOne((type) => Dsp, (dsp) => dsp.retailers)
  dsp: Dsp
}
