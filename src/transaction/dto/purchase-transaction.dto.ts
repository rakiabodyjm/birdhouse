import { PartialType } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator'
import { Caesar } from 'src/caesar/entities/caesar.entity'
import Inventory from 'src/inventory/entities/inventory.entity'
import { ExistsInDb } from 'src/pipes/validation/ExistsInDb'

export class PurchaseTransactionBodyDto {
  @IsNumber()
  @IsNotEmpty()
  quantity: number
}

export class PurchaseTransactionParamsDto {
  @IsNotEmpty()
  @ExistsInDb(Inventory, 'id', {
    message: `Inventory doesn't exist`,
  })
  // @IsNumber()
  inventory_from: string

  @IsNotEmpty()
  @ExistsInDb(Caesar, 'id', {
    message: `Caesar doesn't exist for this buyer`,
  })
  @IsUUID()
  buyer: string
}
