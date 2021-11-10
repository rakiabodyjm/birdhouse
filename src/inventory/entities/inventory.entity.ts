import { Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export default class Inventory {
  @PrimaryGeneratedColumn('uuid')
  id: string
}
