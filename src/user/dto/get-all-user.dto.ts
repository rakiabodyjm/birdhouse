import { PartialType } from '@nestjs/mapped-types'
// import { PartialType } from '@nestjs/swagger'
import { IsNumber } from 'class-validator'
import { PaginateOptions } from 'src/types/Paginated'

// export class GetAllUserDto PartialType(PaginateOptions) {}

export class GetAllUserDto extends PartialType(PaginateOptions) {}
