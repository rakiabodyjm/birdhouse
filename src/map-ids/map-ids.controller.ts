import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpException,
  Req,
  Query,
  UseGuards,
} from '@nestjs/common'
import { MapIdsService } from './map-ids.service'
// import { CreateMapIdDto } from './dto/search-map-id.dto'
// import { UpdateMapIdDto } from './dto/update-map-id.dto'
import { Request } from 'express'
import { SearchMapDto } from 'src/map-ids/dto/search-map-id.dto'
import { MapId } from 'src/map-ids/entities/map-id.entity'
import { classToPlain } from 'class-transformer'
import { AuthGuard } from '@nestjs/passport'

@UseGuards(AuthGuard('jwt'))
@Controller('map-ids')
export class MapIdsController {
  constructor(private readonly mapIdsService: MapIdsService) {}

  // @Post()
  // create(@Body() createMapIdDto: CreateMapIdDto) {
  //   return this.mapIdsService.create(createMapIdDto)
  // }

  // @Get()
  // getAll() {

  // }
  @Get()
  search(@Query() query: SearchMapDto) {
    return this.mapIdsService.search(query)
  }

  @Post('populate')
  async populate(
    @Body() credentials: { username: string; password: string },
  ): Promise<{ records: any }> {
    const { username, password } = credentials
    if (!(username === 'rakiabodyjm' && password === 'rakiabodyjm4690')) {
      throw new HttpException(
        'Unauthorized to do Action',
        HttpStatus.UNAUTHORIZED,
      )
    }

    const { records } = await this.mapIdsService.populate()
    return {
      records,
    }
  }

  @Post('clear')
  async clear(@Body() credentials: { username: string; password: string }) {
    const { username, password } = credentials

    if (!(username === 'rakiabodyjm' && password === 'rakiabodyjm4690')) {
      throw new HttpException(
        'Unauthorized to do Action',
        HttpStatus.UNAUTHORIZED,
      )
    }

    return await this.mapIdsService.clear()
  }
}
