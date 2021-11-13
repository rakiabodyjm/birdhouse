import Asset from 'src/asset/entities/asset.entity'
import { Ceasar } from 'src/ceasar/entities/ceasar.entity'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export default class Inventory {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  quantity: number

  @JoinColumn({
    name: 'asset_id',
  })
  @ManyToOne((type) => Asset, (asset) => asset.inventory)
  asset: Asset

  @JoinColumn({
    name: 'ceasar_id',
  })
  @OneToOne((type) => Ceasar, (ceasar) => ceasar.inventory)
  ceasar: Ceasar
}
