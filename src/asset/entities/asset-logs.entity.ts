import { Admin } from 'src/admin/entities/admin.entity'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class AssetLog {
  @PrimaryGeneratedColumn('increment')
  id: string

  @Column()
  method: string

  @Column()
  data: string

  @Column()
  remarks: string

  //   @JoinColumn({
  //     name: 'admin_id',
  //   })
  //   @ManyToMany(() => {})
  //   admin: Admin
}
