import { IsNotEmpty } from 'class-validator'

export class SearchDspDto {
  @IsNotEmpty()
  searchQuery: string
}
