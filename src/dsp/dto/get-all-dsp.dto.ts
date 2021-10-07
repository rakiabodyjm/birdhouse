import { HttpException, HttpStatus } from '@nestjs/common'
import { PartialType } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import { IsBoolean, IsBooleanString, IsOptional, IsUUID } from 'class-validator'
import { CreateDspDto } from 'src/dsp/dto/create-dsp.dto'
import { ExistsInDb } from 'src/pipes/validation/ExistsInDb'
import { Subdistributor } from 'src/subdistributor/entities/subdistributor.entity'
import { PaginateOptions } from 'src/types/Paginated'

export class GetAllDspDto extends PartialType(PaginateOptions) {
  @IsOptional()
  @IsUUID()
  @ExistsInDb(Subdistributor, 'id', {
    message: `Subdistributor for this DSP doesn't exist`,
  })
  subdistributor: string

  /**
   * note order is important
   */
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
