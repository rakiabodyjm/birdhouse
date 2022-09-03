import { IsUUID } from 'class-validator'

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
