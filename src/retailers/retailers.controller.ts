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
import SearchRetailerDto from 'src/retailers/dto/search-retailer.dto'
import * as csvToJson from 'csvtojson'
import * as path from 'path'
import * as fs from 'fs'
import { CreateRetailerOnlyDto } from './dto/create-retailer-only.dto'
@Controller('retailer')
@ApiTags('Retailer Routes')
@UseInterceptors(ClassSerializerInterceptor)
export class RetailersController {
  constructor(private readonly retailersService: RetailersService) {}

  @Post()
  create(@Body() createRetailerDto: CreateRetailerDto): Promise<Retailer> {
    return this.retailersService.create(createRetailerDto)
  }

  @Post('cash-transfer')
  createRetailerOnly(
    @Body() createRetailerOnlyDto: CreateRetailerOnlyDto,
  ): Promise<Retailer> {
    return this.retailersService.createRetailerOnly(createRetailerOnlyDto)
  }

  @Get()
  findAll(
    @Query() query: GetAllRetailerDto,
  ): Promise<Paginated<Retailer> | Retailer[] | number> {
    return this.retailersService.findAll(query)
  }

  @Get('search')
  async search(
    @Query() searchQueryDto: SearchRetailerDto,
  ): Promise<Retailer[]> {
    const query = searchQueryDto['searchQuery']

    return this.retailersService.search(query, searchQueryDto)
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

  @Get('csv-retailer')
  async getRetailer() {
    const filePath = path.resolve(
      process.cwd(),
      './data/DITO-RETAILER-ACCOUNTS.csv',
    )
    let dsps = []
    let dspCounts = {}
    const retailers = await csvToJson()
      .fromFile(filePath)
      .then(
        (
          res: {
            date: string
            dsp_name: string
            customer_name: string
            first_name: string
            last_name: string
            address: string
            number: string
          }[],
        ) => {
          const filtered = []
          const retailerFiltered = res.filter((ea) => {
            if (!!ea.number && !!(ea.number.length > 0)) {
              return true
            }
            filtered.push(ea)
            return false
          })
          retailerFiltered.map((ea) => {
            if (!dsps.includes(ea.dsp_name)) {
              dsps = [...dsps, ea.dsp_name]
              dspCounts = {
                ...dspCounts,
                [ea.dsp_name]: 0,
              }
            }
            dspCounts[ea.dsp_name] = dspCounts[ea.dsp_name] + 1
          })
          console.log('filtered', filtered)
          return retailerFiltered
        },
      )
      .then((res) => {
        console.log(dsps)
        console.log(dspCounts)
        console.log(res.length)
        return res
      })
    return retailers
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.retailersService.findOne(id).catch((err) => {
      throw new HttpException(err.message, HttpStatus.NOT_FOUND)
    })
  }
}
