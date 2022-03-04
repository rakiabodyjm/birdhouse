import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { InventoryService } from './inventory.service'
import { InventoryController } from './inventory.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import Inventory from 'src/inventory/entities/inventory.entity'
import { CaesarModule } from 'src/caesar/caesar.module'
import { AssetModule } from 'src/asset/asset.module'
import { AuthModule } from 'src/auth/auth.module'
import { UserModule } from 'src/user/user.module'
import { InventoryLog } from 'src/inventorylog/entities/inventory-logs.entity'
import { Caesar } from 'src/caesar/entities/caesar.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Inventory, InventoryLog, Caesar]),
    CaesarModule,
    AssetModule,
    AuthModule,
    UserModule,
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    //Use InventoryCrudLoggerMiddleware
    // consumer
    //   .apply(InventoryCrudLoggerMiddleware)
    //   .exclude({
    //     path: 'inventory',
    //     method: RequestMethod.GET,
    //   })
    //   .forRoutes(InventoryController)
    /**
     * we can insert another consumer.apply for another middleware
     */
  }
}
