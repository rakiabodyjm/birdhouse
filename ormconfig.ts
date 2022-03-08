import { config } from 'dotenv'
import { SqlServerConnectionOptions } from 'typeorm/driver/sqlserver/SqlServerConnectionOptions'

config({
  path:
    process.env.NODE_ENV === 'production'
      ? './.env.production'
      : './.env.development',
})

const SQLConfig: SqlServerConnectionOptions & {
  options: { trustServerCertificate: boolean }
} = {
  type: 'mssql',
  host: process.env.SQL_SERVER_HOST,
  port: Number(process.env.SQL_SERVER_PORT),
  username: process.env.SQL_SERVER_USERNAME,
  password: process.env.SQL_SERVER_PASSWORD,
  database: process.env.SQL_SERVER_DATABASE,
  synchronize: false,
  options: {
    trustServerCertificate: true,
  },
  entities: ['dist/src/**/*.entity{.ts,.js}'],
  migrations: ['dist/db/migrations/*.js'],
  cli: {
    migrationsDir: 'db/migrations',
  },
  logging: false,
}

export default SQLConfig
