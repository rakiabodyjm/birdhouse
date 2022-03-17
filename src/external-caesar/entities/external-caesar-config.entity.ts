import { Exclude } from 'class-transformer'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class ExternalCaesarConfig {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: string

  @Column()
  peso_rate: string

  @Column()
  dollar_rate: string
}
