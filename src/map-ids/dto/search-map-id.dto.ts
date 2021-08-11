import {
  ArrayContains,
  IsEnum,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator'

// enum FieldValues {
//   area_id = 'area_id',
//   area_name = 'area_name',
//   parent_name = 'parent_name',
//   parent_parent_name = 'parent_parent_name',
//   area_parent_pp_nmae = 'area_parent_parent_name',
// }

export class SearchMapDto {
  @IsString()
  @IsOptional()
  search?: string

  @IsNumberString()
  @IsOptional()
  page?: number

  @IsOptional()
  @IsNumberString()
  limit?: number
}
