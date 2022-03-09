import { AuthGuard } from '@nestjs/passport'
import { IS_PUBLIC_KEY } from './../auth/decorators/public.decorator'
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'
import { User } from 'src/user/entities/user.entity'
import { UserService } from 'src/user/user.service'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private userService: UserService,
  ) {
    super()
  }
  context: ExecutionContext
  exception = ['external-caesar']

  canActivate(context: ExecutionContext) {
    this.context = context
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic || this.isException()) {
      return true
    }

    return super.canActivate(context)
  }

  /**
   *
   * gather token from header
   *
   *
   */
  getTokenFromHeader() {
    const request: Request = this.context.switchToHttp().getRequest()
    const token = request.headers.authorization?.split(' ')[1]

    return token
  }

  /**
   * Links that do not need checking
   */
  isException() {
    const { url }: Request = this.context.switchToHttp().getRequest()

    const isException = this.exception.some((ea) => url.split('/').includes(ea))
    return isException
  }

  async getUserFromToken(token: string) {
    const { user_id } = this.jwtService.decode(token) as {
      [key: string]: any
    }
    return await this.userService.findOne(user_id)
  }
}
