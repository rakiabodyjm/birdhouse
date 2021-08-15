import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
  let app = await NestFactory.create(AppModule)

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

  /**
   * Global validation pipe
   */
  app = app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  const port = process.env.PORT || 6000

  await app.listen(port)
}

bootstrap()

// readWorkBook()
