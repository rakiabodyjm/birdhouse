import { JwtService } from '@nestjs/jwt'
import { ExtractJwt } from 'passport-jwt'
import { IS_PUBLIC_KEY } from '../auth/decorators/public.decorator'
import {
  BadGatewayException,
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { UserService } from 'src/user/user.service'
import { User } from 'src/user/entities/user.entity'
import { catchError, Observable, throwError } from 'rxjs'
import { Request } from 'express'

/**
 * Responsibility is attach user to request header
 *
 * includes checking for roles metadata
 *
 * include checking for isPublic metadata
 */
@Injectable()
export class JwtAuthInterceptor implements NestInterceptor {
  constructor(
    private reflector: Reflector,
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}
  user: User

  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    try {
      const request: Request = context.switchToHttp().getRequest()
      console.log('is this public', this.isPublic(context))
      if (this.isPublic(context)) {
        return next.handle()
      }

      const user = await this.validateJwtFromHeader(
        request.headers.authorization,
      ).catch((err) => {
        throw err
      })
      // request.user = user
      return next.handle()
    } catch (err) {
      return next
        .handle()
        .pipe(
          catchError((err) =>
            throwError(() => new BadGatewayException(err.message)),
          ),
        )
    }
  }

  async validateJwtFromHeader(reqHeaders: Request['headers']['authorization']) {
    try {
      if (!reqHeaders) {
        throw new Error(`No Authorization`)
      }
    } catch (err) {
      console.log('error', err.message)
      throw new UnauthorizedException(`Unauthorized`)
    }
  }
  isPublic(context: ExecutionContext) {
    const isPublicValue = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    )
    return isPublicValue
  }
}
