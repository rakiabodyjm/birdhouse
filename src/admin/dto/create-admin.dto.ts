import { IsAlpha, IsString } from 'class-validator'
import { Admin } from 'src/admin/entities/admin.entity'
import { ExistsInDb } from 'src/pipes/validation/ExistsInDb'
import { NoDuplicateInDb } from 'src/pipes/validation/NoDuplicateInDb'
import { User } from 'src/user/entities/user.entity'

export class CreateAdminDto {
  @IsString({
    message: `Admin name must be string`,
  })
  @NoDuplicateInDb(Admin, 'name', {
    message: 'Admin name already used',
  })
  name: string

  @IsString({
    message: 'User must be string',
  })
  @ExistsInDb(User, 'id', {
    message: `User account doesn't exist`,
  })
  @NoDuplicateInDb(Admin, 'user', {
    message: `User account already used`,
  })
  user: User
}
