import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { InjectRepository } from '@nestjs/typeorm'
import { isNotEmptyObject } from 'class-validator'
import { GetAllDspDto } from 'src/dsp/dto/get-all-dsp.dto'
import { SearchDspDto } from 'src/dsp/dto/search-dsp.dto'
import { Dsp } from 'src/dsp/entities/dsp.entity'
import { MapIdsService } from 'src/map-ids/map-ids.service'
import paginateFind from 'src/utils/paginate'
import createQueryBuilderAndIncludeRelations from 'src/utils/queryBuilderWithRelations'
import { Repository } from 'typeorm'
import { CreateDspDto } from './dto/create-dsp.dto'
import { UpdateDspDto } from './dto/update-dsp.dto'

@Injectable()
export class DspService {
  constructor(
    @InjectRepository(Dsp) private dspRepository: Repository<Dsp>,
    private mapidService: MapIdsService,
    private eventEmitter: EventEmitter2,
  ) {
    this.includedRelations = ['area_id', 'user', 'subdistributor']
  }

  includedRelations: string[]

  async create(createDspDto: CreateDspDto) {
    const { area_id } = createDspDto

    /**
     * nullify ID as it's autogenerated
     * conversion of newDSP var to DSP type since .save() requires DSP
     */
    const newDSP = {
      ...createDspDto,
      area_id: null,
    }

    newDSP.area_id = await this.mapidService.getMapIdsFromArray(area_id)
    // newDSP.area_id = area_id

    const dspSave = await this.dspRepository.save(
      this.dspRepository.create(newDSP),
    )
    const userAccount = (await this.findOne(dspSave.id)).user
    this.eventEmitter.emit('telco-account.created', {
      ...userAccount,
      account_type: 'dsp',
    })
    return dspSave
  }

  async findAll(getAllDspDto: GetAllDspDto) {
    if (!isNotEmptyObject(getAllDspDto)) {
      const dsps = await this.dspRepository.find({
        relations: this.includedRelations,
      })
      return dsps
    } else {
      const queryDsp = await paginateFind(
        this.dspRepository,
        {
          limit: getAllDspDto.limit,
          page: getAllDspDto.page,
        },
        {
          relations: this.includedRelations,
          //if subdistributor query
          ...(getAllDspDto.subdistributor && {
            where: {
              subdistributor: getAllDspDto.subdistributor,
            },
          }),
        },
      )
      if (getAllDspDto.countOnly) {
        return queryDsp.metadata.total
      }
      return queryDsp
    }
  }

  async searchDsp(
    searchString: string,
    whereQuery: Omit<SearchDspDto, 'searchQuery'>,
  ) {
    const { subdistributor } = whereQuery
    let query = createQueryBuilderAndIncludeRelations(this.dspRepository, {
      entityName: 'dsp',
      relations: this.includedRelations,
    }).where(
      '(subdistributor.name like :searchString OR user.first_name like :searchString OR user.last_name like :searchString OR dsp.dsp_code like :searchString OR dsp.e_bind_number like :searchString)',
    )

    if (subdistributor) {
      query = query.andWhere('dsp.subdistributor = :subdistributor')
    }

    return query
      .setParameters({
        searchString: `%${searchString}%`,
        subdistributor,
      })
      .take(100)
      .getMany()
  }
  async findOne(id?: string) {
    try {
      return await this.dspRepository.findOneOrFail(id, {
        relations: this.includedRelations,
      })
    } catch (err) {
      throw err
    }
  }

  async update(id: string, updateDspDto: UpdateDspDto) {
    const dspToBeUpdated = await this.findOne(id)
      .then((res) => ({ ...res, ...updateDspDto } as Dsp))
      .catch((err) => {
        throw err
      })

    const { area_id } = updateDspDto
    if (area_id) {
      dspToBeUpdated.area_id = await this.mapidService.getMapIdsFromArray(
        area_id,
      )
    }
    await this.dspRepository.save(dspToBeUpdated)
    return dspToBeUpdated
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
