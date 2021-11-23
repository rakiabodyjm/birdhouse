import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator'
import Asset from 'src/asset/entities/asset.entity'
import { Ceasar } from 'src/ceasar/entities/ceasar.entity'
import { ExistsInDb } from 'src/pipes/validation/ExistsInDb'

export class CreateInventoryDto {
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  quantity: number

  @IsNotEmpty({
    message: `Asset should not be empty`,
  })
  @ExistsInDb(Asset, 'id', {
    message: `Asset doesn't exist`,
  })
  asset: string

  @IsNotEmpty({
    message: `Ceasar ID should not be empty`,
  })
  @ExistsInDb(Ceasar, 'id', {
    message: ``,
  })
  ceasar: string
}
