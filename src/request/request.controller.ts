import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { CreateRequestDto } from './dto/create-request.dto'
import { GetAllRequestDto } from './dto/get-all-request.dto'
import { UpdateRequestDto } from './dto/update-request.dto'
import { RequestService } from './request.service'

@Controller('request')
export class RequestController {
  constructor(private requestService: RequestService) {}

  @Post()
  create(@Body() createRequest: CreateRequestDto) {
    return this.requestService.create(createRequest)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRequest: UpdateRequestDto) {
    return this.requestService.update(id, updateRequest)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.requestService.findOne(id)
  }

  @Get()
  findAll(@Query() getAllRequest: GetAllRequestDto) {
    return this.requestService.findAll(getAllRequest)
  }
}
