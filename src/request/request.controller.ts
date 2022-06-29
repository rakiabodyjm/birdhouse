import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ErrorsInterceptor } from 'src/interceptors/error.interceptor'
import { Repository } from 'typeorm'
import { CreateRequestDto } from './dto/create-request.dto'
import { GetAllRequestDto } from './dto/get-all-request.dto'
import { UpdateRequestDto } from './dto/update-request.dto'
import { Request } from './entities/request.entity'
import { RequestService } from './request.service'

@Controller('request')
@UseInterceptors(ErrorsInterceptor, ClassSerializerInterceptor)
export class RequestController {
  constructor(
    private readonly requestService: RequestService,
    @InjectRepository(Request)
    private requestRepository: Repository<Request>,
  ) {}

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

  @Get('search')
  search(@Query() getAllRequest: GetAllRequestDto) {
    return this.requestService.search(getAllRequest)
  }
}
