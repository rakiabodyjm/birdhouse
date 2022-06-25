import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import paginateFind from 'src/utils/paginate'
import { Repository } from 'typeorm'
import { CreateRequestDto } from './dto/create-request.dto'
import { GetAllRequestDto } from './dto/get-all-request.dto'
import { UpdateRequestDto } from './dto/update-request.dto'
import { Request } from './entities/request.entity'

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(Request)
    private requestRepo: Repository<Request>,
  ) {}

  relations = ['caesar_bank']

  async create(createRequest: CreateRequestDto) {
    const newRequest = this.requestRepo.create(createRequest)
    return this.requestRepo.save(newRequest)
  }

  findOne(id: string) {
    return this.requestRepo.findOneOrFail(id).catch((err) => {
      throw new Error(err.message)
    })
  }

  async update(id: string, updateRequest: UpdateRequestDto) {
    const request = await this.findOne(id)

    return this.requestRepo.save({
      ...request,
      ...updateRequest,
    })
  }

  async findAll(getAllRequest: GetAllRequestDto) {
    const { amount, as, status, caesar_bank, ct_ref, id } = getAllRequest

    const commonQuery = {
      ...(as && {
        as,
      }),
      ...(amount && {
        amount,
      }),
      ...(status && {
        status,
      }),
      ...(caesar_bank && {
        caesar_bank,
      }),
      ...(ct_ref && {
        ct_ref,
      }),
      ...(id && {
        id,
      }),
    }

    return paginateFind(
      this.requestRepo,
      {
        page: getAllRequest.page,
        limit: getAllRequest.limit,
      },
      {
        where: commonQuery,
        relations: [...this.relations],
        withDeleted: true,
      },
      (data) => {
        return Promise.all(
          data.map(async (ea) => {
            const returnValue = plainToInstance(Request, {
              ...ea,
            })

            return returnValue
          }),
        )
      },
    )
  }
}
