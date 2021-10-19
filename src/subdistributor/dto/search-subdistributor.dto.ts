import { IsNotEmpty } from 'class-validator'

export class SearchSubdistributorDto {
  @IsNotEmpty()
  searchQuery: string
}
