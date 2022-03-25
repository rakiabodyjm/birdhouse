import { CacheModule, Module } from '@nestjs/common'
import { ActualCaesarService } from './actual-caesar.service'
import { ActualCaesarController } from './actual-caesar.controller'
import { HttpModule } from '@nestjs/axios'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
  imports: [
    CacheModule.register({
      ttl: 30,
      max: 50,
    }),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        baseURL: configService.get('CAESAR_HOST'),
        params: {
          api_key: 'cs_b7c524cd0882fb32333af561faf8519d',
          url: 'telco.com',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [ActualCaesarController],
  providers: [ActualCaesarService],
  exports: [ActualCaesarService],
})
export class ActualCaesarModule {}
