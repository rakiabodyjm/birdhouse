import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { config } from 'dotenv'
import { SqlServerConnectionOptions } from 'typeorm/driver/sqlserver/SqlServerConnectionOptions'

config()
const SQLConfig: SqlServerConnectionOptions & {
  options: { trustServerCertificate: boolean }
} = {
  type: 'mssql',
  host: process.env.SQL_SERVER_HOST,
  port: Number(process.env.SQL_SERVER_PORT),
  username: process.env.SQL_SERVER_USERNAME,
  password: process.env.SQL_SERVER_PASSWORD,
  database: process.env.SQL_SERVER_DATABASE,
  synchronize: true,
  options: {
    trustServerCertificate: process.env.NODE_ENV === 'development',
  },
  entities: ['dist/src/**/*.entity.js'],
  migrations: ['dist/src/db/migrations/*.js'],
  cli: {
    migrationsDir: 'src/db/migrations',
  },
}

export default SQLConfig
