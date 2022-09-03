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
  //     message: `Caesar ID should not be empty`,
  //   })
  //   @ExistsInDb(Caesar, 'id', {
  //     message: ``,
  //   })
  //   caesar: Caesar
}
