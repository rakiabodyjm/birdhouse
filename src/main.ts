import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { useContainer } from 'typeorm'
import { AppModule } from './app.module'

async function bootstrap() {
  let app = await NestFactory.create(AppModule, {
    logger: true,
  })
  app = app.useGlobalPipes(new ValidationPipe())
  const port = process.env.PORT || 6000

  await app.listen(port)
}

bootstrap()

// readWorkBook()
