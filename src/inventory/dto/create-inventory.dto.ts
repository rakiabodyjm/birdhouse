import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator'
import Asset from 'src/asset/entities/asset.entity'
import { Caesar } from 'src/caesar/entities/caesar.entity'
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

  @ExistsInDb(Caesar, 'id', {
    message: `Account doesn't exist in Caesar`,
  })
  @IsNotEmpty({
    message: `Caesar must not be empty`,
  })
  caesar: string
}
