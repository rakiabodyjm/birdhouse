import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { AuthService } from 'src/auth/auth.service'
import { User } from 'src/user/entities/user.entity'
import { UserService } from 'src/user/user.service'

@Injectable()
export class InventoryCrudLoggerMiddleware implements NestMiddleware {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.headers.authorization) {
        throw new UnauthorizedException(`User not logged in`)
      }
      const bareToken = req.headers.authorization.replace('Bearer ', '')

      try {
        this.authService.validateJwt(bareToken)
      } catch (err) {
        throw new Error(`Session Expired`)
      }

      let user: User
      try {
        const userTokenData = this.authService.decode(bareToken)
        user = await this.userService.findOne(
          (userTokenData as { user_id: string }).user_id,
        )
      } catch (err) {
        throw new Error(err.message)
      }
    } catch (err) {
      throw new UnauthorizedException(err.message)
    }

    next()
  }
}
