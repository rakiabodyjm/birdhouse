import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'
import { Observable } from 'rxjs'

@Injectable()
export class PayCaesarSecretGuard implements CanActivate {
  constructor(private configService: ConfigService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest()

    return (
      this.configService.get('SECRET_KEY') ===
      request.headers['pay-caesar-secret']
    )
  }
}
