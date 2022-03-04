import { Module } from '@nestjs/common'
import { InventoryLogService } from './inventorylog.service'
import { InventoryLogController } from './inventorylog.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { InventoryLog } from 'src/inventorylog/entities/inventory-logs.entity'

@Module({
  imports: [TypeOrmModule.forFeature([InventoryLog])],
  controllers: [InventoryLogController],
  providers: [InventoryLogService],
})
export class InventoryLogModule {}
