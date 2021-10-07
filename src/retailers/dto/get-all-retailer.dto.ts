import { HttpException, HttpStatus } from '@nestjs/common'
import { PartialType } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsBooleanString, IsOptional, IsUUID } from 'class-validator'
import { Dsp } from 'src/dsp/entities/dsp.entity'
import { ExistsInDb } from 'src/pipes/validation/ExistsInDb'
import { Subdistributor } from 'src/subdistributor/entities/subdistributor.entity'
import { PaginateOptions } from 'src/types/Paginated'

export class GetAllRetailerDto extends PartialType(PaginateOptions) {
  @IsOptional()
  @IsUUID()
  @ExistsInDb(Subdistributor, 'id', {
    message: `Subdistributor doesn't exist`,
  })
  subdistributor?: string

  @IsOptional()
  @IsUUID()
  @ExistsInDb(Dsp, 'id', {
    message: `DSP Doesn't exist`,
  })
  dsp?: string

  @IsOptional()
  @Transform(({ value }) => {
    if (!['true', 'false'].includes(value)) {
      throw new HttpException(
        `Invalid boolean value for countOnly`,
        HttpStatus.BAD_REQUEST,
      )
    }

    if (value === 'true') {
      return true
    } else {
      return false
    }
  })
  countOnly: boolean
}
