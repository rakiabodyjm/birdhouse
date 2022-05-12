import { IntersectionType } from '@nestjs/mapped-types'
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator'
import { Caesar } from 'src/caesar/entities/caesar.entity'
import { CaesarBank } from 'src/cash-transfer/entities/caesar-bank.entity'
import {
  CashTransfer,
  CashTransferAs,
} from 'src/cash-transfer/entities/cash-transfer.entity'
import { ExistsInDb } from 'src/pipes/validation/ExistsInDb'
import { NoDuplicateInDb } from 'src/pipes/validation/NoDuplicateInDb'

export class DepositCashTransfer {
  @IsOptional()
  @ExistsInDb(Caesar, 'id', {
    message: `Caesar Doesn't exist`,
  })
  from: any

  @IsOptional()
  @ExistsInDb(CaesarBank, 'id', {
    message: `Caesar's bank Account FROM doesn't exist`,
  })
  caesar_bank_to: any
}

export class WithdrawCashTrashTransfer {
  @IsOptional()
  @ExistsInDb(Caesar, 'id', {
    message: `Caesar Doesn't exist`,
  })
  to: any

  @IsOptional()
  @ExistsInDb(CaesarBank, 'id', {
    message: `Caesar's bank Account TO doesn't exist`,
  })
  caesar_bank_from: any
}

export class TransferCashTransfer {
  @IsOptional()
  @ExistsInDb(CaesarBank, 'id', {
    message: `Caesar's bank Account FROM doesn't exist`,
  })
  caesar_bank_to: any

  @IsOptional()
  @ExistsInDb(CaesarBank, 'id', {
    message: `Caesar's bank Account TO doesn't exist`,
  })
  caesar_bank_from: any

  @IsOptional()
  @ExistsInDb(Caesar, 'id', {
    message: `Caesar's Account TO doesn't exist`,
  })
  to: any

  @IsOptional()
  @ExistsInDb(Caesar, 'id', {
    message: `Caesar's Account TO doesn't exist`,
  })
  from: any

  @IsOptional()
  message: string
}

export class LoanCashTransfer {
  @IsOptional()
  @ExistsInDb(CaesarBank, 'id', {
    message: `LOAN | Caesar bank from doesn't exist `,
  })
  caesar_bank_from: any

  @IsOptional()
  @ExistsInDb(CaesarBank, 'id', {
    message: `LOAN | Caesar bank to doesn't exist`,
  })
  caesar_bank_to: any

  @IsOptional()
  @ExistsInDb(Caesar, 'id', {
    message: `LOAN | Caesar to doesn't exist`,
  })
  to: any
}
export class GenericCashTransfer {
  @IsNotEmpty({
    message: `Amount is required`,
  })
  @IsNumber()
  amount: number

  @NoDuplicateInDb(CashTransfer, 'ct_name', {
    message: 'Cash Transfer ID already used',
  })
  ref_num: string

  @IsOptional()
  description: string

  @IsEnum(CashTransferAs, {
    message: `Transaction Type AS required`,
  })
  // @IsOptional()
  @IsNotEmpty({
    message: `Transaction Type AS should not be empty`,
  })
  as: CashTransferAs

  @IsOptional()
  bank_fee: number

  @IsOptional()
  interest: number
}

export class CreateCashTransferDto extends IntersectionType(
  IntersectionType(
    IntersectionType(WithdrawCashTrashTransfer, DepositCashTransfer),
    IntersectionType(TransferCashTransfer, GenericCashTransfer),
  ),
  LoanCashTransfer,
) {}
