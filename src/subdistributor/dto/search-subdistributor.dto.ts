import { IsNotEmpty, IsOptional } from 'class-validator'

export class SearchSubdistributorDto {
  @IsOptional()
  searchQuery?: string
}
