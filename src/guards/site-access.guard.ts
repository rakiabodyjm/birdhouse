import { UserService } from 'src/user/user.service'
import { IS_PUBLIC_KEY } from './../auth/decorators/public.decorator'
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'
import { User } from 'src/user/entities/user.entity'
import { AuthGuard } from '@nestjs/passport'
import { ExtractJwt } from 'passport-jwt'
import { JwtService } from '@nestjs/jwt'

/**
 * SiteAccessGuard is mixed AuthGuard('jwt')
 * and signed cookie verification
 *
 * Only allows Authorization Headers of Admin
 */
@Injectable()
export class SiteAccessGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private reflector: Reflector,
  ) {}
  context: ExecutionContext
  exception = ['external-caesar']

  async canActivate(context: ExecutionContext) {
    this.context = context
    const request: Request = context.switchToHttp().getRequest()

    const user = request.user as User

    const cookie = request.signedCookies.ra
    if (!cookie) {
      // console.log(
      //   'no Cookie found but are we allowing?: ',
      //   !!user?.admin || this.isException(),
      // )
      return !!user?.admin || this.isException() || this.isPublic()
    }

    const cookieValid = await this.jwtService
      .verifyAsync(cookie)
      .catch((err) => false)
    return !!cookieValid
  }
  isException() {
    const { url }: Request = this.context.switchToHttp().getRequest()

    const isException = this.exception.some((ea) => url.split('/').includes(ea))
    return isException
  }

  isPublic() {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      this.context.getHandler(),
      this.context.getClass(),
    ])
    return isPublic
  }
}
