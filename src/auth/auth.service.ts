import { Injectable } from '@nestjs/common'
import { isEmail } from 'class-validator'
import { User } from 'src/user/entities/user.entity'
import { UserService } from 'src/user/user.service'
import { Bcrypt } from 'src/utils/Bcrypt'

@Injectable()
export class AuthService {
  constructor(private usersService: UserService) {}
  /**
   *
   * @param email email | username
   * @param password password
   */
  async validateUser(email: string, password: string): Promise<User> {
    let user: User | null
    if (isEmail(email)) {
      /**
       * Email credentials to be used
       */
      user = await this.usersService.findByEmail(email)
      // console.log('user from email', user)
    } else {
      // console.log('user from username', user)
      user = await this.usersService.findByUsername(email)
    }

    if (!user) {
      throw new Error(`User doesn't exist`)
    }
    const isPasswordCorrect = Bcrypt().isPasswordCorrect(
      password,
      user.password,
    )
    if (!isPasswordCorrect) {
      throw new Error(`Password incorrect`)
    }

    return user
  }

  //   async getRole(id) {
  //     const adminRoles: UserRoles[] = ['admin', 'dsp']
  //   }
}
