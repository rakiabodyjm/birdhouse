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
import { SearchMapDto } from 'src/map-ids/dto/search-map-id.dto'
import { ApiTags } from '@nestjs/swagger'

// @UseGuards(AuthGuard('jwt'))
@ApiTags('MapID Routes')
@Controller('map-ids')
export class MapIdsController {
  constructor(private readonly mapIdsService: MapIdsService) {}
  // @Get()
  // findAll(): Promise<MapId[]> {
  //   return this.mapIdsService.findAll()
  // }
  @Get()
  search(@Query() query?: SearchMapDto) {
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
