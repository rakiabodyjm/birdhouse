import { HttpException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Dsp } from 'src/dsp/entities/dsp.entity'
import { Repository } from 'typeorm'
import { CreateDspDto } from './dto/create-dsp.dto'
import { UpdateDspDto } from './dto/update-dsp.dto'

@Injectable()
export class DspService {
  constructor(@InjectRepository(Dsp) private dspRepository: Repository<Dsp>) {}

  async create(createDspDto: CreateDspDto) {
    const newDSP = this.dspRepository.create(createDspDto)
    console.log('creating dsp', newDSP)
    await this.dspRepository.save(newDSP)
    return newDSP
  }

  async findAll() {
    try {
      const dsps = await this.dspRepository
        .find({
          relations: ['area_id', 'user'],
        })
        .then((res) => {
          return res
        })
        .catch((err) => {
          console.error(err)
        })

      return dsps ? dsps : []
    } catch (err) {
      throw Error(err)
    }
  }

  async findOne(id: string) {
    return await this.dspRepository.findOne(id)
  }

  async update(id: string, updateDspDto: UpdateDspDto) {
    const dsp = await this.dspRepository.findOne(id)

    if (!dsp) {
      throw new Error('DSP Not found')
    }
    await this.dspRepository.update(id, {
      ...updateDspDto,
    })
    return {
      ...dsp,
      ...updateDspDto,
    }
    // const dsp = this.dspRepository
    //   .createQueryBuilder()
    //   .update(Dsp)
    //   .where({ id })
    //   .set({
    //     ...updateDspDto,
    //   })
    //   .execute()

    // return dsp

    // return `This action updates a #${id} dsp`
  }

  remove(id: number) {
    this.dspRepository.delete(id)
  }

  async clear() {
    return this.dspRepository.clear()
  }
}
