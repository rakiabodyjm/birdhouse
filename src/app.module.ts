import { CacheModule, Module } from '@nestjs/common'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './user/user.module'
import { ConfigModule } from '@nestjs/config'
import { MapIdsModule } from './map-ids/map-ids.module'
import { DspModule } from './dsp/dsp.module'
import { config } from 'dotenv'
import { AdminModule } from './admin/admin.module'
import { AuthModule } from './auth/auth.module'
import { RetailersModule } from './retailers/retailers.module'
import { SubdistributorModule } from './subdistributor/subdistributor.module'

config()
const additionalOptions = {
  type: 'mssql',
  host: process.env.SQL_SERVER_HOST,
  port: Number(process.env.SQL_SERVER_PORT),
  username: process.env.SQL_SERVER_USERNAME,
  password: process.env.SQL_SERVER_PASSWORD,
  database: process.env.SQL_SERVER_DATABASE,
  synchronize: true,
  retryAttempts: 100,
  // logging: true,
  options: {
    trustServerCertificate: process.env.NODE_ENV === 'development',
  },
  // entities: [User, MapId, Dsp],
  autoLoadEntities: true,
  pool: {
    // idleTimeoutMillis: 100000,
    // max: 14000,
    // min: 0,
  },
} as TypeOrmModuleOptions

@Module({
  imports: [
    CacheModule.register(),
    ConfigModule.forRoot({
      envFilePath: '.development.env',
    }),
    TypeOrmModule.forRoot({
      // entities: ['/dist/src/**/*.entity{.ts,.js}'],
      // entities: [User],
      // type: 'sqlite',
      // database: ':memory:',
      // logging: true,
      // synchronize: true,
      ...additionalOptions,
    }),
    MapIdsModule,
    DspModule,
    UserModule,
    AdminModule,
    AuthModule,
    RetailersModule,
    SubdistributorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
