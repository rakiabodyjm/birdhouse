import { Injectable, Query } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { isNotEmptyObject } from 'class-validator'
import { GetAllDspDto } from 'src/dsp/dto/get-all-dsp.dto'
import { Dsp } from 'src/dsp/entities/dsp.entity'
import paginateFind from 'src/utils/paginate'
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

  async findAll(getAllDspDto: GetAllDspDto) {
    if (!isNotEmptyObject(getAllDspDto)) {
      const dsps = await this.dspRepository.find({
        relations: ['area_id', 'user'],
      })
      return dsps
    } else {
      return await paginateFind(
        this.dspRepository,
        {
          limit: getAllDspDto.limit,
          page: getAllDspDto.page,
        },
        {
          relations: ['area_id', 'user'],
        },
      )
    }
    // try {
    //   return dsps ? dsps : []
    // } catch (err) {
    //   throw Error(err)
    // }
  }

  async findOne(id: string) {
    try {
      return await this.dspRepository.findOneOrFail(id)
    } catch (err) {
      throw err
    }
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
    } as Dsp
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

  async remove(id: string) {
    const dspFind = await this.findOne(id)
    await this.dspRepository.delete(id)
    return dspFind
  }

  async clear() {
    return this.dspRepository.clear()
  }
}
