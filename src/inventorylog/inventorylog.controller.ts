import {
  Controller,
  Get,
  // Post,
  // Body,
  // Patch,
  // Param,
  // Delete,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common'
import { InventoryLogService } from './inventorylog.service'
// import { CreateInventoryLogDto } from './dto/create-inventorylog.dto'
// import { UpdateInventoryLogDto } from './dto/update-inventorylog.dto'
import { GetAllInventoryLogDto } from './dto/get-all-inventorylog.dto'

@UseInterceptors(ClassSerializerInterceptor)
@Controller('inventory-log')
export class InventoryLogController {
  constructor(private readonly inventorylogService: InventoryLogService) {}

  @Get()
  findAll(@Query() queries: GetAllInventoryLogDto) {
    // return 'hello world'
    //return queries
    return this.inventorylogService.findAll(queries)
  }
}
