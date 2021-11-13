import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator'
import Inventory from 'src/inventory/entities/inventory.entity'
import { ExistsInDb } from 'src/pipes/validation/ExistsInDb'

export class PurchaseFromInventoryDto {
  @IsNotEmpty()
  @ExistsInDb(Inventory, 'id', {
    message: `Inventory doesn't exist`,
  })
  id: string
}
export class PurchaseTransactionDto {
  @IsNotEmpty()
  @IsNumber()
  quantity: number

  @IsUUID()
  seller: string
}
