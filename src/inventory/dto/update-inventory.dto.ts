import { PartialType } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber } from 'class-validator'
import { CreateInventoryDto } from './create-inventory.dto'

export class UpdateInventoryDto {
  @IsNumber()
  @IsNotEmpty()
  quantity: number
}
