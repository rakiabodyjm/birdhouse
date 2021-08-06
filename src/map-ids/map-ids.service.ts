import { Injectable } from '@nestjs/common'
import { CreateMapIdDto } from './dto/create-map-id.dto'
import { UpdateMapIdDto } from './dto/update-map-id.dto'

@Injectable()
export class MapIdsService {
  create(createMapIdDto: CreateMapIdDto) {
    return 'This action adds a new mapId'
  }

  findAll() {
    return `This action returns all mapIds`
  }

  findOne(id: number) {
    return `This action returns a #${id} mapId`
  }

  update(id: number, updateMapIdDto: UpdateMapIdDto) {
    return `This action updates a #${id} mapId`
  }

  remove(id: number) {
    return `This action removes a #${id} mapId`
  }
}
