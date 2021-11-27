import { Module } from '@nestjs/common'
import { AssetService } from './asset.service'
import { TypeOrmModule } from '@nestjs/typeorm'
// import Asset from 'src/assets/entities/asset.entity'
import Asset from 'src/asset/entities/asset.entity'
import { AssetController } from 'src/asset/asset.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Asset])],
  controllers: [AssetController],
  providers: [AssetService],
  exports: [AssetService],
})
export class AssetModule {}
