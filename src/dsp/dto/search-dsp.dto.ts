import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator'
import { ExistsInDb } from 'src/pipes/validation/ExistsInDb'
import { Subdistributor } from 'src/subdistributor/entities/subdistributor.entity'

export class SearchDspDto {
  @IsNotEmpty()
  searchQuery: string

  @IsOptional()
  @IsUUID()
  @ExistsInDb(Subdistributor, 'id')
  subdistributor?: string
}
