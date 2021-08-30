import { PartialType } from '@nestjs/swagger'
import { CreateSubdistributorDto } from './create-subdistributor.dto'

export class UpdateSubdistributorDto extends PartialType(
  CreateSubdistributorDto,
) {}
