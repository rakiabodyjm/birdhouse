import { IsNotEmpty, IsString } from 'class-validator'

export default class SearchRetailerDto {
  @IsNotEmpty()
  searchQuery: string
}
