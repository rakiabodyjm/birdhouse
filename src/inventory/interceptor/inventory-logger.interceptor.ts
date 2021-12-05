import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Observable, tap } from 'rxjs'
import { CeasarService } from 'src/ceasar/ceasar.service'
import { InventoryLog } from 'src/inventory/entities/inventory-logs.entity'
import { Repository } from 'typeorm'

@Injectable()
export class InventoryLoggerInterceptor implements NestInterceptor {
  constructor(
    private ceasarService: CeasarService,
    @InjectRepository(InventoryLog)
    inventoryLogsRepository: Repository<InventoryLog>,
  ) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // console.log('Before ...')

    const now = Date.now()

    const req = context.switchToHttp().getRequest()
    if (['GET', 'POST', 'PATCH', 'DELETE'].includes(req.method)) {
      // console.log('HEADERS', req.headers)
    }
    // console.log(req.user)

    return next
      .handle()
      .pipe(tap(() => console.log(`After ... ${Date.now() - now}ms`)))
  }
}
