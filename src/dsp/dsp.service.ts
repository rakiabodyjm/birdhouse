import { Injectable } from '@nestjs/common'
import { CreateDspDto } from './dto/create-dsp.dto'
import { UpdateDspDto } from './dto/update-dsp.dto'

@Injectable()
export class DspService {
  create(createDspDto: CreateDspDto) {
    return 'This action adds a new dsp'
  }

  findAll() {
    return `This action returns all dsp`
  }

  findOne(id: number) {
    return `This action returns a #${id} dsp`
  }

  update(id: number, updateDspDto: UpdateDspDto) {
    return `This action updates a #${id} dsp`
  }

  remove(id: number) {
    return `This action removes a #${id} dsp`
  }
}
