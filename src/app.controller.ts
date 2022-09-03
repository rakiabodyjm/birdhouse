import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('')
  sendWelcome() {
    return `Welcome to REALM1000 Project Alpha`
  }
}
