import { Module } from '@nestjs/common'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './user/user.module'
import { ConfigModule } from '@nestjs/config'
import { User } from 'src/user/entities/user.entity'
// import { MapIdService } from './map-id/map-id.service';
// import { MapIdController } from './map-id/map-id.controller';
// import { MapIdModule } from './map-id/map-id.module';
import { MapIdsModule } from './map-ids/map-ids.module'
import { DspModule } from './dsp/dsp.module'

const additionalOptions = {
  type: 'mssql',
  host: '192.168.1.14',
  port: 1433,
  username: 'sa',
  password: 'rakiabodyjm4690',
  database: 'dito_db',
  synchronize: true,
  logging: true,
  entities: [User],
  options: {
    trustServerCertificate: true,
  },
} as TypeOrmModuleOptions

@Module({
  imports: [
    UserModule,
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
