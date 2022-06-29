import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import paginateFind from 'src/utils/paginate'
import { Like, Repository } from 'typeorm'
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

  search(params: GetAllRequestDto) {
    const likeQuery = params?.searchQuery
      ? Like(`%${params.searchQuery}%`)
      : undefined

    return paginateFind(
      this.requestRepo,
      {
        ...params,
      },
      {
        relations: [...this.relations],
        ...(likeQuery && {
          order: {
            created_at: 'DESC',
          },
          where: [
            {
              amount: likeQuery,
            },
          ].map((ea) => ({
            ...ea,
          })),
        }),
      },
    )
  }

  async findAll(getAllRequest: GetAllRequestDto) {
    const { amount, as, caesar_bank, ct_ref, id } = getAllRequest

    const commonQuery = {
      ...(as && {
        as,
      }),
      ...(amount && {
        amount,
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
