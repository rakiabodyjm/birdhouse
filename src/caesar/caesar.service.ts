import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { isNotEmptyObject } from 'class-validator'
import { GetAllCaesarDto } from 'src/caesar/dto/get-all-caesar.dto'
import { Caesar } from 'src/caesar/entities/caesar.entity'
import { Paginated } from 'src/types/Paginated'
import { AccountTypes, UserTypesAndUser } from 'src/types/Roles'
import paginateFind from 'src/utils/paginate'
import { Like, Repository } from 'typeorm'
import { HttpService } from '@nestjs/axios'
import { User } from 'src/user/entities/user.entity'
import { firstValueFrom, map } from 'rxjs'
import { AxiosError, AxiosResponse } from 'axios'
import { GetCaesarDto } from 'src/caesar/dto/get-caesar.dto'
import { ExternalCaesar } from 'src/external-caesar/entities/external-caesar.entity'
import { SearchCaesarDto } from 'src/caesar/dto/search-caesar.dto'
import { plainToClass, plainToInstance } from 'class-transformer'
import createQueryBuilderAndIncludeRelations from 'src/utils/queryBuilderWithRelations'
import { UpdateCaesarDto } from 'src/caesar/dto/update-caesar.dto'
// import { ConfigService } from '@nestjs/config'

@Injectable()
export class CaesarService {
  constructor(
    @InjectRepository(Caesar)
    private readonly caesarRepository: Repository<Caesar>,
    private axiosService: HttpService, // private caesarApiService: CaesarApiService, // private configService: ConfigService,
  ) {}
  relations = [
    'admin',
    'subdistributor',
    'dsp',
    'retailer',
    'user',
    'bank_accounts',
  ]

  async create({
    userAccount,
    ...account
  }: {
    userAccount: User
  } & Partial<Record<UserTypesAndUser, AccountTypes>> & {
      password: string
    }) {
    const account_type = Object.keys(account)[0] as UserTypesAndUser

    /**
     * Formulate Body Request to External Caesar
     */
    const newCaesarUser: Partial<ExternalCaesar> = {
      first_name: userAccount.first_name,
      last_name: userAccount.last_name,
      cp_number: userAccount.phone_number,
      email: userAccount.email,
      role: account_type,
      password: userAccount.password,
    }
    const caesar_id$ = this.axiosService
      .post('/external-caesar', newCaesarUser)
      .pipe(map((response) => response.data as string))
    const caesar_id = await firstValueFrom(caesar_id$).catch(
      (err: AxiosError) => {
        throw new Error(err.response.data.message)
      },
    )

    /**
     * Create local record of Caesar into dito_db
     */
    const caesarCreate = this.caesarRepository.create({
      // account_id: account[account_type],
      account_type,
      caesar_id,
      [account_type]: account[account_type],
    })

    const newCaesar = await this.caesarRepository.save(caesarCreate)
    return this.injectExternalCaesar(newCaesar)
  }

  async findAll(
    params?: GetAllCaesarDto,
  ): Promise<Paginated<Caesar> | Caesar[]> {
    if (!isNotEmptyObject(params)) {
      return await this.caesarRepository
        .find({
          take: 100,
          relations: this.relations,
          where: {
            ...(params?.account_type && {
              account_type: params.account_type,
            }),
          },
        })
        .then(async (res) => {
          const withExternalCaesar = await Promise.all(
            res.map(async (caesar) => {
              return await this.injectExternalCaesar(caesar).catch(() => null)
            }),
          )
          return this.removeNullsFromCaesarArray(withExternalCaesar)
        })
    } else {
      return await paginateFind<Caesar>(this.caesarRepository, params, {
        where: {
          ...(params?.account_type && {
            account_type: params.account_type,
          }),
        },
        relations: this.relations,
      }).then(async (paginatedCaesar) => {
        const externalCaesarData = await Promise.all(
          paginatedCaesar.data.map(async (caesar) => {
            return await this.injectExternalCaesar(caesar).catch(() => null)
          }),
        )
        return {
          ...paginatedCaesar,
          data: this.removeNullsFromCaesarArray(externalCaesarData),
        }
      })
    }
  }

  clear() {
    if (process.env.NODE_ENV === 'development') {
      return this.caesarRepository.clear().then(() => {
        return `Caesar Cleared`
      })
    }
  }

  private removeNullsFromCaesarArray(params: Caesar[]) {
    return params.filter((ea) => !!ea).map((ea) => plainToClass(Caesar, ea))
  }

  search(searchCaesarDto: SearchCaesarDto) {
    const { searchQuery } = searchCaesarDto
    const { page = 0, limit = 100 } = searchCaesarDto
    delete searchCaesarDto.searchQuery

    const query = createQueryBuilderAndIncludeRelations(this.caesarRepository, {
      entityName: 'caesar',
      relations: this.relations,
    })
      .where('subdistributor.name like :searchString')
      .orWhere('dsp.dsp_code like :searchString')
      .orWhere('user.first_name like :searchString')
      .orWhere('user.last_name like :searchString')
      .orWhere('admin.name like :searchString')
      .orWhere('retailer.store_name like :searchString')
      .setParameters({
        searchString: `%${searchQuery}%`,
      })
      .orderBy('caesar.created_at', 'DESC')
      .take(limit)
      .skip(page * limit)
      .getManyAndCount()
      .then(async ([res, count]) => {
        // const returner = [await this.injectExternalCaesar(res), count]
        return {
          caesars: (
            await this.injectExternalCaesar(
              this.removeNullsFromCaesarArray(res),
            )
          ).map((ea) => plainToClass(Caesar, ea)),
          count,
        }
      })
      .then(({ caesars: res, count }) => {
        return {
          data: res,
          metadata: {
            limit,
            page,
            total: count,
            total_page: Math.ceil((count as number) / limit),
          },
        } as Paginated<Caesar>
      })
    return query
  }

  searchV2(params: SearchCaesarDto) {
    const likeQuery = params?.searchQuery
      ? Like(`%${params.searchQuery}%`)
      : undefined
    return paginateFind(
      this.caesarRepository,
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
              admin: {
                name: likeQuery,
              },
            },
            {
              subdistributor: {
                name: likeQuery,
              },
            },
            {
              dsp: {
                dsp_code: likeQuery,
              },
            },
            {
              retailer: {
                store_name: likeQuery,
              },
            },
            {
              user: {
                first_name: likeQuery,
              },
            },
            {
              user: {
                last_name: likeQuery,
              },
            },
          ],
        }),
      },
    )
  }
  findOne<T = GetCaesarDto>(accountQuery: T): Promise<Caesar>
  findOne<T = string>(caesarId: T): Promise<Caesar>
  findOne(id: GetCaesarDto | string) {
    if (typeof id === 'string') {
      const caesar = this.caesarRepository
        .findOneOrFail(id, {
          // relations: ['admin', 'dsp', 'retailer', 'subdistributor', 'user'],
          relations: this.relations,
        })
        .then(async (res) => {
          const withExternalCaesar = await this.injectExternalCaesar(res).catch(
            (err) => {
              // console.error(err)
              return null
            },
          )
          return plainToClass(Caesar, withExternalCaesar)
        })
        .catch((err) => {
          throw new Error(err.message)
        })
      return caesar
    } else {
      const account_type = Object.keys(id)[0] as UserTypesAndUser

      const caesar = this.caesarRepository
        .findOneOrFail(
          {
            [account_type]: id[account_type],
            account_type,
          },
          {
            relations: this.relations,
          },
        )
        .then(async (res) => {
          const withExternalCaesar = await this.injectExternalCaesar(res).catch(
            (err) => {
              return null
            },
          )
          return plainToClass(Caesar, withExternalCaesar)
        })
        .catch((err) => {
          // console.error(err)
          throw new Error(err.message)
        })
      return caesar
    }
  }

  injectExternalCaesar<T>(localCaesar: T): Promise<T>
  injectExternalCaesar<T>(localCaesar: T[]): Promise<T[]>
  async injectExternalCaesar(localCaesar): Promise<Caesar | Caesar[]> {
    if (!Array.isArray(localCaesar)) {
      //TODO handle error
      const caesarExternalData$ = this.axiosService
        .get('/external-caesar/' + localCaesar.caesar_id)
        .pipe(map((response: AxiosResponse) => response.data))

      const caesarExternalData = await firstValueFrom(
        caesarExternalData$,
      ).catch((err) => {
        // return null
        throw new Error(err)
      })
      const caesarWithData = {
        ...localCaesar,
        data: caesarExternalData,
      }

      const returnInject = plainToClass(Caesar, caesarWithData)
      return returnInject
    } else {
      return Promise.all(
        localCaesar.map(async (caesar) => {
          return { ...(await this.injectExternalCaesar(caesar)) }
        }),
      )
    }
  }

  async pay(caesar: Caesar, amount: number) {
    let caesarAccount = await this.findOne(caesar.id)
    if (!caesarAccount?.data) {
      caesarAccount = await this.injectExternalCaesar(caesarAccount)
    }

    const topUpResponse = firstValueFrom(
      this.axiosService
        .post('/external-caesar/topup/' + caesarAccount.data.wallet_id, {
          amount,
        })
        .pipe(
          map((response: AxiosResponse) => response.data as ExternalCaesar),
        ),
    ).catch((err) => {
      throw new Error(err.message)
    })
    return topUpResponse
  }

  // update(id: string, updateCaesar: UpdateCaesarDto) {
  //   console.log(updateCaesar)
  //   return this.findOne(id).then(async (res) => {
  //     console.log(res)
  //     if (updateCaesar.banks) {
  //       updateCaesar.banks = [
  //         ...(await Promise.all(
  //           updateCaesar.banks.map((ea) =>
  //             this.bankService.findOne(ea).catch((err) => {
  //               throw new Error(`Bank doesn't exist ${ea}`)
  //             }),
  //           ),
  //         )),
  //       ]
  //     }
  //     return this.caesarRepository.save({
  //       ...res,
  //       ...updateCaesar,
  //     })
  //   })
  // }

  async update(
    id: string,
    updateCaesarDto: UpdateCaesarDto & {
      has_loan?: boolean
    },
  ) {
    const caesar = await this.findOne(id)
    return this.caesarRepository.save({
      ...caesar,
      ...plainToInstance(Caesar, { ...updateCaesarDto }),

      // ...(updateCaesarDto?.operator && { operator: updateCaesarDto.operator }),
      // ...(updateCaesarDto as Partial<Caesar>),
    })
  }

  async payCashTransferBalance(caesar: Caesar | Caesar['id'], amount: number) {
    let currentCaesar: Caesar
    if (typeof caesar === 'string') {
      currentCaesar = await this.findOne(caesar)
    } else {
      currentCaesar = caesar
    }
    return this.caesarRepository.save({
      ...currentCaesar,
      cash_transfer_balance: currentCaesar.cash_transfer_balance + amount,
    })
  }
}
