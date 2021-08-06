import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common'
import { MapIdsService } from './map-ids.service'
import { CreateMapIdDto } from './dto/create-map-id.dto'
import { UpdateMapIdDto } from './dto/update-map-id.dto'

@Controller('map-ids')
export class MapIdsController {
  constructor(private readonly mapIdsService: MapIdsService) {}

  @Post()
  create(@Body() createMapIdDto: CreateMapIdDto) {
    return this.mapIdsService.create(createMapIdDto)
  }

  @Get()
  findAll() {
    return this.mapIdsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mapIdsService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMapIdDto: UpdateMapIdDto) {
    return this.mapIdsService.update(+id, updateMapIdDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mapIdsService.remove(+id)
  }
}
