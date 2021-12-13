import { CacheModule, forwardRef, Module } from '@nestjs/common'
import { CaesarService } from './caesar.service'
import { CaesarController } from './caesar.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Caesar } from 'src/caesar/entities/caesar.entity'
import { UserModule } from 'src/user/user.module'
import { HttpModule } from '@nestjs/axios'
import { config } from 'dotenv'
config()
@Module({
  imports: [
    CacheModule.register(),
    TypeOrmModule.forFeature([Caesar]),
    forwardRef(() => UserModule),
    HttpModule.register({
      baseURL: process.env.REST_HOST,
    }),
  ],
  controllers: [CaesarController],
  providers: [CaesarService],
  exports: [CaesarService],
})
export class CaesarModule {}
