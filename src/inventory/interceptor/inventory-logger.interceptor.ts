import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  RequestMethod,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { InjectRepository } from '@nestjs/typeorm'
import { Request } from 'express'
import { Observable } from 'rxjs'
import { ROLES_KEY } from 'src/auth/decorators/roles.decorator'
import { CaesarService } from 'src/caesar/caesar.service'
import { InventoryLog } from 'src/inventory/entities/inventory-logs.entity'
import { Roles } from 'src/types/Roles'
import { Repository } from 'typeorm'

@Injectable()
export class InventoryLoggerInterceptor implements NestInterceptor {
  constructor(
    private caesarService: CaesarService,
    @InjectRepository(InventoryLog)
    private inventoryLogsRepository: Repository<InventoryLog>,
    private reflector: Reflector,
  ) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req: Request = context.switchToHttp().getRequest()
    if (['POST', 'PATCH', 'DELETE'].includes(req.method)) {
      const role = this.reflector.getAllAndOverride<Roles[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ])

      // const now = Date.now()
      /**
       * Get user and method variables from request
       */
      const { user, method } = req
      const caesar = await this.caesarService.findOne({
        [role[0]]: user[`${role[0]}`],
      })

      const inventoryLog = this.inventoryLogsRepository.create({
        created_at: Date.now(),
        data: JSON.stringify(req?.body),
        method: method as keyof typeof RequestMethod,
        caesar: caesar,
      })
      next.handle().subscribe({
        error: async (err) => {
          inventoryLog.remarks = err.message
          inventoryLog.created_at = new Date()
          await this.inventoryLogsRepository.save(inventoryLog)
        },
        complete: async () => {
          inventoryLog.remarks = JSON.stringify('SUCCESS')
          inventoryLog.created_at = new Date()
          await this.inventoryLogsRepository.save(inventoryLog)
        },
      })

      return next.handle()
    }

    return next.handle()
    // .pipe(tap(() => console.log(`After ... ${Date.now() - now}ms`)))
  }
}
