import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getHello(): string {
    return 'REALM1000 | DITO DATABASE v1.0'
  }
}
