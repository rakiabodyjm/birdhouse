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
    private reflector: Reflector,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    const request: Request = context.switchToHttp().getRequest()

    if (isPublic) {
      console.log('isPublic, allowing bypass of SiteAccessGuard')
      return true
    }
    const user = request.user as User

    const cookie = request.signedCookies.ra
    if (!cookie) {
      console.log('no Cookie found but are we allowing?: ', !!user?.admin)
      return !!user?.admin
    }
  }
}
