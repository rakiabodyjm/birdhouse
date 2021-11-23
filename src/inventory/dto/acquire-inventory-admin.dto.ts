import { Transform } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsPositive, IsUUID } from 'class-validator'
import Asset from 'src/asset/entities/asset.entity'
import { ExistsInDb } from 'src/pipes/validation/ExistsInDb'

export class AcquireInventoryAdmin {
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
  @IsUUID()
  asset: string

  //   @IsNotEmpty({
  //     message: `Ceasar ID should not be empty`,
  //   })
  //   @ExistsInDb(Ceasar, 'id', {
  //     message: ``,
  //   })
  //   ceasar: Ceasar
}
