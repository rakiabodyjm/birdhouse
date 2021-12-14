import Asset from 'src/asset/entities/asset.entity'
import { Caesar } from 'src/caesar/entities/caesar.entity'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
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
    name: 'caesar_id',
  })
  @ManyToOne((type) => Caesar, (caesar) => caesar.inventory)
  caesar: Caesar

  @Column()
  active: boolean
}
