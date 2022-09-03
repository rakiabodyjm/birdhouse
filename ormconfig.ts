import { config } from 'dotenv'
import { readdirSync } from 'fs'
import { SqlServerConnectionOptions } from 'typeorm/driver/sqlserver/SqlServerConnectionOptions'

const envFiles = readdirSync(process.cwd()).filter((fileName) =>
  /.env/.test(fileName),
)

const prodEnvFiles = envFiles
  .filter((file) => /.production/.test(file))
  .sort((a) => (/.local/.test(a) ? -1 : 1))
const devEnvFiles = envFiles
  .filter((file) => /.development/.test(file))
  .sort((a) => (/.local/.test(a) ? -1 : 1))

config({
  path:
    process.env.NODE_ENV === 'production' ? prodEnvFiles[0] : devEnvFiles[0],
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
  // synchronize: process.env.NODE_ENV === 'development',
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
