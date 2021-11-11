import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'
import { Dsp } from 'src/dsp/entities/dsp.entity'
import { ExistsInDb } from 'src/pipes/validation/ExistsInDb'
import { Subdistributor } from 'src/subdistributor/entities/subdistributor.entity'

export default class SearchRetailerDto {
  @IsNotEmpty()
  searchQuery: string

  @IsOptional()
  @IsUUID()
  @ExistsInDb(Subdistributor, 'id', {
    message: `Subdistributor Account doesn't exist`,
  })
  subdistributor?: string

  @IsOptional()
  @IsUUID()
  @ExistsInDb(Dsp, 'id', {
    message: `DSP Account doesn't exist`,
  })
  dsp?: string
}
