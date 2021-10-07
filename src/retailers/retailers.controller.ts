import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common'
import { RetailersService } from './retailers.service'
import { CreateRetailerDto } from './dto/create-retailer.dto'
import { UpdateRetailerDto } from './dto/update-retailer.dto'
import { Retailer } from 'src/retailers/entities/retailer.entity'
import { Paginated } from 'src/types/Paginated'
import { createEntityMessage } from 'src/types/EntityMessage'
import { ApiTags } from '@nestjs/swagger'
import { GetAllRetailerDto } from 'src/retailers/dto/get-all-retailer.dto'

@Controller('retailer')
@ApiTags('Retailer Routes')
@UseInterceptors(ClassSerializerInterceptor)
export class RetailersController {
  constructor(private readonly retailersService: RetailersService) {}

  @Post()
  create(@Body() createRetailerDto: CreateRetailerDto): Promise<Retailer> {
    return this.retailersService.create(createRetailerDto)
  }

  @Get()
  findAll(
    @Query() query: GetAllRetailerDto,
  ): Promise<Paginated<Retailer> | Retailer[] | number> {
    return this.retailersService.findAll(query)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.retailersService.findOne(id).catch((err) => {
      throw new HttpException(err.message, HttpStatus.NOT_FOUND)
    })
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRetailerDto: UpdateRetailerDto,
  ) {
    return this.retailersService.update(id, updateRetailerDto).catch((err) => {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST)
    })
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const retailer = await this.retailersService.remove(id).catch((err) => {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST)
    })
    return createEntityMessage(retailer, 'Entity Retailer Deleted')
  }
}
