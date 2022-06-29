import { Request } from 'src/request/entities/request.entity'
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity()
@Index(['id'])
@Index(['id', 'to', 'from'])
@Index(['id', 'request_id'])
@Index(['id', 'req_ref'])
export class OTP {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  code_length: string

  @Column()
  from: string

  @Column()
  pin_expire: string

  @Column()
  to: string

  @Column({
    nullable: true,
  })
  price: string

  @Column({
    nullable: true,
  })
  request_id: string

  @JoinColumn({
    name: 'req_ref',
  })
  @ManyToOne(() => Request, (request) => request.otp)
  req_ref: Request

  @Column({ default: false })
  verified: boolean

  @Column({
    nullable: true,
  })
  code: string

  @CreateDateColumn({
    type: 'datetime',
  })
  created_at: Date

  @UpdateDateColumn({
    type: 'datetime',
  })
  updated_at: Date

  @DeleteDateColumn({
    type: 'datetime',
  })
  deleted_at: Date
}
