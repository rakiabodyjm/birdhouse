import { JwtAuthGuard } from 'src/guards/jwt-auth.guard'
import { JwtModule } from '@nestjs/jwt'
import { CacheModule, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './user/user.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MapIdsModule } from './map-ids/map-ids.module'
import { DspModule } from './dsp/dsp.module'
import { AdminModule } from './admin/admin.module'
import { AuthModule } from './auth/auth.module'
import { RetailersModule } from './retailers/retailers.module'
import { SubdistributorModule } from './subdistributor/subdistributor.module'
import { CaesarModule } from './caesar/caesar.module'
import { ExternalCaesarModule } from './external-caesar/external-caesar.module'
import { AssetModule } from './asset/asset.module'
import { InventoryModule } from './inventory/inventory.module'
import { TransactionModule } from './transaction/transaction.module'
import { InventoryLogModule } from './inventorylog/inventorylog.module'
import SQLConfig from 'root/ormconfig'
import { SiteAccessGuard } from 'src/guards/site-access.guard'

@Module({
  imports: [
    CacheModule.register(),
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? './.env.production'
          : './.env.development',
      isGlobal: true,
      cache: true,
    }),
    TypeOrmModule.forRoot(SQLConfig),
    UserModule,
    MapIdsModule,
    DspModule,
    AdminModule,
    AuthModule,
    RetailersModule,
    SubdistributorModule,
    CaesarModule,
    ExternalCaesarModule,
    InventoryModule,
    AssetModule,
    TransactionModule,
    InventoryLogModule,
    JwtModule.registerAsync({
      useFactory: async (configservice: ConfigService) => ({
        verifyOptions: {
          ignoreExpiration: false,
        },
        secret: configservice.get<string>('SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [
    ...(process.env.NODE_ENV === 'development'
      ? []
      : [
          {
            provide: 'APP_GUARD',
            useClass: JwtAuthGuard,
          },
          {
            provide: 'APP_GUARD',
            useClass: SiteAccessGuard,
          },
        ]),

    AppService,
  ],
})
export class AppModule {}
