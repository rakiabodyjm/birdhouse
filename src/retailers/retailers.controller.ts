import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common'
import { RetailersService } from './retailers.service'
import { CreateRetailerDto } from './dto/create-retailer.dto'
import { UpdateRetailerDto } from './dto/update-retailer.dto'

@Controller('retailers')
export class RetailersController {
  constructor(private readonly retailersService: RetailersService) {}

  @Post()
  create(@Body() createRetailerDto: CreateRetailerDto) {
    return this.retailersService.create(createRetailerDto)
  }

  @Get()
  findAll() {
    return this.retailersService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.retailersService.findOne(+id)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRetailerDto: UpdateRetailerDto,
  ) {
    return this.retailersService.update(+id, updateRetailerDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.retailersService.remove(+id)
  }
}
