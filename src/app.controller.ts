import { Controller, Get } from '@nestjs/common'
import { Public } from 'src/auth/decorators/public.decorator'
import { AppService } from './app.service'
@Public()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('')
  sendWelcome() {
    return `Welcome to REALM1000 Project Alpha`
  }
}
