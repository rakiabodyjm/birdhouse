import { IsEnum, IsNumber, IsOptional } from 'class-validator'
import { Caesar } from 'src/caesar/entities/caesar.entity'
import { CaesarBank } from 'src/cash-transfer/entities/caesar-bank.entity'
import { CashTransferAs } from 'src/cash-transfer/entities/cash-transfer.entity'
import { TransferType } from 'src/cash-transfer/entities/transfer-type.entity'
import { ExistsInDb } from 'src/pipes/validation/ExistsInDb'

export class CreateCashTransferDto {
  @ExistsInDb(TransferType, 'id', {
    message: `Transfer Type doesn't exist`,
  })
  //   transfer_type: TransferType['id']
  transfer_type: any

  @ExistsInDb(CaesarBank, 'id', {
    message: `Caesar's bank Account doesn't exist`,
  })
  //   caesar_bank: CaesarBank['id']
  caesar_bank: any

  @IsNumber()
  amount: number

  @ExistsInDb(Caesar, 'id', {
    message: `Caesar Doesn't exist`,
  })
  from: any

  @ExistsInDb(Caesar, 'id', {
    message: `Caesar Doesn't exist`,
  })
  to: any

  @IsOptional()
  description: string

  @IsEnum(CashTransferAs)
  @IsOptional()
  tag?: CashTransferAs
}
