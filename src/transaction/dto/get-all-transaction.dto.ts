import { PartialType } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'
import { Caesar } from 'src/caesar/entities/caesar.entity'
import Inventory from 'src/inventory/entities/inventory.entity'
import { ExistsInDb } from 'src/pipes/validation/ExistsInDb'
import { PaginateOptions } from 'src/types/Paginated'

class InventoryDto {
  @IsOptional()
  @ExistsInDb(Inventory, 'id', {
    message: `Source inventory not found`,
  })
  inventory_from?: string

  @IsOptional()
  @ExistsInDb(Inventory, 'id', {
    message: `Destination Inventory not found`,
  })
  inventory_to?: string
}

/**
 * seller
 * buyer
 */

class BuyerSellerDto {
  @IsOptional()
  @ExistsInDb(Caesar, 'id', {
    message: `Buyer Caesar doesn't exist`,
  })
  buyer?: string

  @IsOptional()
  @ExistsInDb(Caesar, 'id', {
    message: `Seller Caesar doesn't exist`,
  })
  seller?: string
}

export class GetAllTransactionDto
  extends PaginateOptions
  implements InventoryDto, BuyerSellerDto
{
  @IsOptional()
  @ExistsInDb(Caesar, 'id', {
    message: `Caesar ID doesn't exist`,
  })
  caesar?: string

  @IsOptional()
  @ExistsInDb(Inventory, 'id', {
    message: `Inventory doesn't exist`,
  })
  inventory?: string

  @IsOptional()
  @ExistsInDb(Inventory, 'id', {
    message: `Source inventory not found`,
  })
  inventory_from?: string

  @IsOptional()
  @ExistsInDb(Inventory, 'id', {
    message: `Destination Inventory not found`,
  })
  inventory_to?: string

  @IsOptional()
  @ExistsInDb(Caesar, 'id', {
    message: `Buyer Caesar doesn't exist`,
  })
  buyer?: string

  @IsOptional()
  @ExistsInDb(Caesar, 'id', {
    message: `Seller Caesar doesn't exist`,
  })
  seller?: string
}
