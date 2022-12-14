import { forwardRef, Module } from '@nestjs/common'
import { CaesarService } from './caesar.service'
import { CaesarController } from './caesar.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Caesar } from 'src/caesar/entities/caesar.entity'
import { UserModule } from 'src/user/user.module'
import { HttpModule } from '@nestjs/axios'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { CaesarApiService } from 'src/caesar/ceasar-api.service'
@Module({
  imports: [
    // CacheModule.register(),
    TypeOrmModule.forFeature([Caesar]),
    forwardRef(() => UserModule),
    ConfigModule,
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          baseURL: configService.get('REST_HOST'),
          headers: {
            'pay-caesar-secret': configService.get('SECRET_KEY'),
          },
        }
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [CaesarController],
  providers: [CaesarService, CaesarApiService],
  exports: [CaesarService],
})
export class CaesarModule {}
