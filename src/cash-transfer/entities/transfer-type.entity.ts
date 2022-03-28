import { CashTransfer } from 'src/cash-transfer/entities/cash-transfer.entity'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class TransferType {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column()
  name: string

  @Column({
    type: 'text',
    nullable: true,
  })
  description?: string

  @OneToMany(
    (type) => CashTransfer,
    (cashtransfer) => cashtransfer.transfer_type,
  )
  cash_transfer: CashTransfer[]
}
