import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsUUID } from 'class-validator'
import { Admin } from 'src/admin/entities/admin.entity'
import { ExistsInDb } from 'src/pipes/validation/ExistsInDb'
import { NoDuplicateInDb } from 'src/pipes/validation/NoDuplicateInDb'
import { User } from 'src/user/entities/user.entity'

export class CreateAdminDto {
  @ApiProperty()
  @IsString({
    message: `Admin name must be string`,
  })
  @NoDuplicateInDb(Admin, 'name', {
    message: 'Admin name already used',
  })
  name: string

  @IsUUID()
  @ApiProperty()
  @IsString({
    message: 'User must be string',
  })
  @ExistsInDb(User, 'id', {
    message: `User account doesn't exist`,
  })
  @NoDuplicateInDb(Admin, 'user', {
    message: `User account already used by another Admin Account`,
  })
  user?: User
}
