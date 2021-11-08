import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthService } from 'src/auth/auth.service'
import { User } from 'src/user/entities/user.entity'
// import { AuthService } from './auth.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    })
  }

  async validate(username: string, password: string): Promise<any> {
    let user: User
    try {
      user = await this.authService.validateUser(username, password)
    } catch (err) {
      throw new UnauthorizedException(err.message)
    }

    return user
  }
}
