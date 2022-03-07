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
import {
  InventoryLog,
  InventoryLogData,
} from 'src/inventorylog/entities/inventory-logs.entity'
import { InventoryService } from 'src/inventory/inventory.service'
import { Roles } from 'src/types/Roles'
import { Repository } from 'typeorm'

@Injectable()
export class InventoryLoggerInterceptor implements NestInterceptor {
  constructor(
    private caesarService: CaesarService,
    @InjectRepository(InventoryLog)
    private inventoryLogsRepository: Repository<InventoryLog>,
    private reflector: Reflector,
    private inventoryService: InventoryService, // private inventoryRepository: Repository<Inventory>
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
    const inventoryFrom = await this.inventoryService.findOne(req.params.id)
    // const updateValues:
    const inventoryLog = this.inventoryLogsRepository.create({
      created_at: new Date(),
      data:
        req.method !== 'PATCH'
          ? JSON.stringify({
              id: inventoryFrom?.id || req.params.id,
              name: inventoryFrom?.name || '',
              description: inventoryFrom?.description || '',
              created: {
                ...(inventoryFrom && inventoryFrom),
              },
            } as InventoryLogData)
          : JSON.stringify({
              id: inventoryFrom?.id,
              name: inventoryFrom?.description,
              description: inventoryFrom?.description,
              updated: {
                ...objectDiff2(
                  await this.inventoryService.findOne(req.params.id),
                  req.body,
                ),
              },
            } as InventoryLogData),
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

/**
 * Function to determine difference in object values
 * object1 type is exactly the same type as object2 type
 */
const objectDiff = (oldValue, newValue): Partial<InventoryLog> => {
  const sort = (obj) =>
    Object.entries(obj)
      .sort(([keyA], [keyB]) =>
        keyA.toLowerCase().localeCompare(keyB.toLowerCase()),
      )
      .reduce(
        (acc, [key, value]) => ({
          ...acc,
          [key]: typeof value === 'object' ? sort(value) : value,
        }),
        {},
      )

  const sorted1 = sort(oldValue)
  const sorted2 = sort(newValue)

  return Object.entries(sorted1).reduce((acc, [key, value]) => {
    // let equality: boolean
    if (JSON.stringify(value) !== JSON.stringify(sorted2[key])) {
      return {
        ...acc,
        [key]: sorted2[key],
      }
    }
    return acc
  }, {})

  // arranged1 = Object.entries(obj1).sort(([keyA, valueA], [keyB, valueB]))

  // const arranged1 = Object.values(obj1).
}

/**
 * Function to determine difference in object types
 * object1 is of Type and object2 is of Partial Type
 */
const objectDiff2 = (obj1, obj2) => {
  return Object.entries(obj2).reduce(
    (acc, [key, value]) => ({
      ...acc,
      ...(obj1[key] !== value && {
        [`${key}_from`]: obj1[key],
        [`${key}_to`]: value,
      }),
    }),
    {},
  )
}
