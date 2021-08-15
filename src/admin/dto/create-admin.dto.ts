import { IsString } from 'class-validator'
import { ExistsInDb } from 'src/pipes/validation/ExistsInDb'
import { User } from 'src/user/entities/user.entity'

export class CreateAdminDto {
  @IsString()
  @ExistsInDb(User, 'id')
  user: User
}
