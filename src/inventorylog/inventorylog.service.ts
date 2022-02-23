import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import paginateFind from 'src/utils/paginate'
import { Repository } from 'typeorm'
// import { CreateInventoryLogDto } from './dto/create-inventorylog.dto'
import { GetAllInventoryLogDto } from './dto/get-all-inventorylog.dto'
import { InventoryLog } from './entities/inventorylog.entity'

@Injectable()
export class InventoryLogService {
  constructor(
    @InjectRepository(InventoryLog)
    private inventoryLogRepo: Repository<InventoryLog>,
  ) {}

  findAll(params: GetAllInventoryLogDto) {
    return paginateFind(this.inventoryLogRepo, params, {
      order: { created_at: 'DESC' },
    })
  }
}
