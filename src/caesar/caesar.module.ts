import { CacheModule, forwardRef, Module } from '@nestjs/common'
import { CaesarService } from './caesar.service'
import { CaesarController } from './caesar.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Caesar } from 'src/caesar/entities/caesar.entity'
import { UserModule } from 'src/user/user.module'
import { HttpModule } from '@nestjs/axios'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { CaesarApiService } from 'src/caesar/ceasar-api.service'
import { CaesarApiController } from 'src/caesar/caesar-api.controller'
import { ActualCaesarModule } from 'src/actual-caesar/actual-caesar.module'
@Module({
  imports: [
    CacheModule.register(),
    TypeOrmModule.forFeature([Caesar]),
    forwardRef(() => UserModule),
    ConfigModule,
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        baseURL: configService.get('REST_HOST'),
        headers: {
          'pay-caesar-secret': configService.get('SECRET_KEY'),
        },
      }),
      inject: [ConfigService],
    }),
    ActualCaesarModule,
  ],
  controllers: [CaesarController, CaesarApiController],
  providers: [CaesarService, CaesarApiService],
  exports: [CaesarService],
})
export class CaesarModule {}
