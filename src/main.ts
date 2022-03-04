import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import * as chalk from 'chalk'
import * as cookieParser from 'cookie-parser'
import cliBoxes from 'cli-boxes'

async function bootstrap() {
  let app = await NestFactory.create(AppModule)

  /**
   * Global validation pipe
   */
  app = app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  )

  app.enableCors({
    credentials: true,
    origin:
      process.env.CLIENT_URL.indexOf(';') > -1
        ? process.env.CLIENT_URL.split(';')
        : process.env.CLIENT_URL,
  })

  app.use(cookieParser(process.env.SECRET_KEY || 'Oasis2089$'))

  const port = process.env.PORT || 6000

  await app.listen(port, () => {
    const topLeft = `${chalk.blueBright(cliBoxes.double.topLeft)}`
    const topRight = `${chalk.blueBright(cliBoxes.double.topRight)}`
    const line = `${chalk
      .blueBright(cliBoxes.double.top)
      .repeat(process.stdout.columns - 2)}`
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
