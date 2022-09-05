import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import * as chalk from 'chalk'
import * as cookieParser from 'cookie-parser'
import cliBoxes from 'cli-boxes'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  /**
   * Global validation pipe
   */
  app
    .useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    )
    .use(cookieParser(process.env.SECRET_KEY || 'Demo_Secret_Key'))
    .enableCors({
      credentials: true,
      // origin: function (origin, callback) {
      //   if (process.env.CLIENT_URL.split(';').indexOf(origin) !== -1) {
      //     callback(null, true)
      //   } else {
      //     callback(new Error('Not allowed by CORS'))
      //   }
      // },
      // origin: true,
      origin:
        process.env.CLIENT_URL.indexOf(';') > -1
          ? process.env.CLIENT_URL.split(';')
          : process.env.CLIENT_URL,
    })

  const port = process.env.PORT || 6000

  await app.listen(port, () => {
    const topLeft = `${chalk.blueBright(cliBoxes.double.topLeft)}`
    const topRight = `${chalk.blueBright(cliBoxes.double.topRight)}`
    const line = `${chalk
      .blueBright(cliBoxes.double.top)
      .repeat(process.stdout.columns ? process.stdout.columns - 2 : 24)}`
    const topBorder = `${topLeft}${line}${topRight}`
    const bottomBorder = `${chalk.blueBright(
      cliBoxes.double.bottomLeft,
    )}${line}${chalk.blueBright(cliBoxes.double.bottomRight)}`
    /**
     * Output
     */

    console.log(`
${topBorder}

${chalk.bgRedBright('REALM1000 TELCO PROJECT')}


${`${chalk.greenBright('Ready on PORT: ')}${chalk.yellow(port)}`}

${chalk.greenBright('REST_HOST: ') + chalk.yellow(process.env.REST_HOST)}
${
  chalk.greenBright('SQL_SERVER_HOST: ') +
  chalk.yellow(process.env.SQL_SERVER_HOST)
}
${
  chalk.greenBright('SQL_SERVER_DATABASE: ') +
  chalk.yellow(process.env.SQL_SERVER_DATABASE)
}
${chalk.greenBright('NODE_ENV: ') + chalk.yellow(process.env.NODE_ENV)}
${
  chalk.greenBright('ALLOWED HOSTS: ') +
  chalk.yellow(process.env.CLIENT_URL).split(';')
}

${
  chalk.greenBright('TIME STARTED: ') +
  chalk.yellow(new Date().toLocaleString()) +
  ' - ' +
  chalk.yellow(new Date().getTime())
}


${bottomBorder}
`)
  })

  /**
   * Swagger Configuration
   */
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Realm1000 DITO API')
    .setDescription('The REALM1000 | DITO Database API Documentation. ')
    .setVersion('1.0')
    .build()

  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      tagSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  })
}

bootstrap()

// readWorkBook()
