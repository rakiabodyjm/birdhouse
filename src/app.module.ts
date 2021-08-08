import { Module } from '@nestjs/common'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './user/user.module'
import { ConfigModule } from '@nestjs/config'
// import { MapIdService } from './map-id/map-id.service';
// import { MapIdController } from './map-id/map-id.controller';
// import { MapIdModule } from './map-id/map-id.module';
import { MapIdsModule } from './map-ids/map-ids.module'
import { DspModule } from './dsp/dsp.module'
import { config } from 'dotenv'
import { AdminModule } from './admin/admin.module'
import { AuthModule } from './auth/auth.module'

config()
const additionalOptions = {
  type: 'mssql',
  host: '192.168.1.14',
  port: 1433,
  username: 'realm1000/dito',
  password: 'Oasis2089$',
  database: 'dito_db',
  synchronize: true,
  logging: false,
  retryAttempts: 100,
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
