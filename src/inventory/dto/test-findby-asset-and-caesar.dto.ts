import { IsOptional, IsUUID } from 'class-validator'
import Asset from 'src/asset/entities/asset.entity'
import { Caesar } from 'src/caesar/entities/caesar.entity'
import { ExistsInDb } from 'src/pipes/validation/ExistsInDb'

export class TestFindByAssetAndCaesarDto {
  //   @ExistsInDb(Asset, 'id', {
  //     message: `Asset doesn't exist`,
  //   })
  //   @IsOptional()
  @IsUUID()
  asset?: string

  //   @ExistsInDb(Caesar, 'id', {
  //     message: `Caesar doesn't exist`,
  //   })
  @IsUUID()
  caesar?: string
}
