import { IsNotEmpty } from 'class-validator'
export class SearchAdminDto {
  @IsNotEmpty()
  searchQuery: string
}
