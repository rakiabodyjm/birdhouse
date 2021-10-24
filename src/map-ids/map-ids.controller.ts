import {
  Controller,
  Get,
  Post,
  Body,
  HttpStatus,
  HttpException,
  Query,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common'
import { MapIdsService } from './map-ids.service'
// import { CreateMapIdDto } from './dto/search-map-id.dto'
// import { UpdateMapIdDto } from './dto/update-map-id.dto'
import { SearchMapDto } from 'src/map-ids/dto/search-map-id.dto'
import { ApiTags } from '@nestjs/swagger'
import { MapId } from 'src/map-ids/entities/map-id.entity'

// @UseGuards(AuthGuard('jwt'))
@ApiTags('MapID Routes')
@Controller('map-ids')
@UseInterceptors(ClassSerializerInterceptor)
export class MapIdsController {
  constructor(private readonly mapIdsService: MapIdsService) {}
  // @Get()
  // findAll(): Promise<MapId[]> {
  //   return this.mapIdsService.findAll()
  // }
  @Get()
  search(@Query() query?: SearchMapDto): Promise<MapId[]> {
    console.log('mapidQuery', query)
    return this.mapIdsService.search(query)
  }

  @Post('populate')
  async populate(): Promise<{ records: any }> {
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
