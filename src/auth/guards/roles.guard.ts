import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY } from 'src/auth/decorators/roles.decorator'
import { Roles } from 'src/types/Roles'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector, // @Inject(REQUEST) private request: Request,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Roles[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (!requiredRoles) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const { user } = request
    return requiredRoles.some((role) => !!user?.[role])
  }
}
