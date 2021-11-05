import { CacheModule, forwardRef, Module } from '@nestjs/common'
import { CeasarService } from './ceasar.service'
import { CeasarController } from './ceasar.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Ceasar } from 'src/ceasar/entities/ceasar.entity'
import { UserModule } from 'src/user/user.module'
import { HttpModule } from '@nestjs/axios'
import { config } from 'dotenv'
config()
@Module({
  imports: [
    CacheModule.register(),
    TypeOrmModule.forFeature([Ceasar]),
    forwardRef(() => UserModule),
    HttpModule.register({
      baseURL: process.env.REST_HOST,
    }),
  ],
  controllers: [CeasarController],
  providers: [CeasarService],
  exports: [CeasarService],
})
export class CeasarModule {}
