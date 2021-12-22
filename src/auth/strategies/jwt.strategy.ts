import { Injectable } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { AuthService } from 'src/auth/auth.service'
import { UserService } from 'src/user/user.service'
// import { jwtConstants } from '../constants'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private readonly userService: UserService,
    private moduleRef: ModuleRef,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_KEY || `Oasis2089$`,
    })
  }

  async validate(payload: any) {
    const user = await this.userService.findOne(payload.user_id)

    return user
    // return { userId: payload.sub, username: payload.username }
  }
}
