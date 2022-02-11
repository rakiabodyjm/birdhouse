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
import { catchError, map, Observable, throwError } from 'rxjs'
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
    // if (['POST', 'PATCH', 'DELETE'].includes(req.method)) {
    //   const role = this.reflector.getAllAndOverride<Roles[]>(ROLES_KEY, [
    //     context.getHandler(),
    //     context.getClass(),
    //   ])

    //   // const now = Date.now()
    //   /**
    //    * Get user and method variables from request
    //    */
    //   const { user, method } = req
    //   const caesar = await this.caesarService.findOne({
    //     [role[0]]: user[`${role[0]}`],
    //   })

    //   const inventoryLog = this.inventoryLogsRepository.create({
    //     created_at: Date.now(),
    //     data: JSON.stringify(req?.body),
    //     method: method as keyof typeof RequestMethod,
    //     caesar: caesar,
    //   })
    //   next.handle().subscribe({
    //     error: async (err) => {
    //       console.log('error handler')
    //       inventoryLog.remarks = err.message
    //       inventoryLog.created_at = new Date()
    //       await this.inventoryLogsRepository.save(inventoryLog)
    //       return throwError(() => err)
    //     },
    //     complete: async () => {
    //       console.log('success  handler')

    //       inventoryLog.remarks = JSON.stringify('SUCCESS')
    //       inventoryLog.created_at = new Date()
    //       await this.inventoryLogsRepository.save(inventoryLog)
    //     },
    //   })
    //   // console.log('handle1')
    //   // return next.handle()
    // }
    // console.log('handle2')
    // return next.handle()
    // // .pipe(tap(() => console.log(`After ... ${Date.now() - now}ms`)))
    const role = this.reflector.getAllAndOverride<Roles[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    const { user } = req

    const inventoryLog = this.inventoryLogsRepository.create({
      created_at: new Date(),
      data: JSON.stringify(req?.body),
      method: req.method as keyof typeof RequestMethod,
      caesar: await this.caesarService.findOne({
        [role[0]]: user[`${role[0]}`],
      }),
    })
    return next.handle().pipe(
      map(async (data) => {
        inventoryLog.remarks = 'SUCCESS'
        await this.inventoryLogsRepository.save(inventoryLog)
        return data
      }),
      catchError(async (err) => {
        inventoryLog.remarks = err.message
        await this.inventoryLogsRepository.save(inventoryLog)
        return throwError(() => err)
      }),
    )
  }
}
