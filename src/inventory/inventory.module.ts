import { Module } from '@nestjs/common'
import { InventoryService } from './inventory.service'
import { InventoryController } from './inventory.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import Inventory from 'src/inventory/entities/inventory.entity'
import { CeasarModule } from 'src/ceasar/ceasar.module'
import { AssetModule } from 'src/asset/asset.module'

@Module({
  imports: [TypeOrmModule.forFeature([Inventory]), CeasarModule, AssetModule],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}
