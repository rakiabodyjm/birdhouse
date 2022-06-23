import { Body, Controller, Post } from '@nestjs/common'
import { CreateRequestDto } from './dto/create-request.dto'
import { RequestService } from './request.service'

@Controller('request')
export class RequestController {
  constructor(private requestService: RequestService) {}

  @Post()
  create(@Body() createRequest: CreateRequestDto) {
    return this.requestService.create(createRequest)
  }
}
