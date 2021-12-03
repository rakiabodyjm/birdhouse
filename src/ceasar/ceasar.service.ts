import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { isNotEmptyObject } from 'class-validator'
import { GetAllCeasarDto } from 'src/ceasar/dto/get-all-ceasar.dto'
import { Ceasar } from 'src/ceasar/entities/ceasar.entity'
import { Paginated } from 'src/types/Paginated'
import { UserTypesAndUser } from 'src/types/Roles'
import paginateFind from 'src/utils/paginate'
import { Repository } from 'typeorm'
import { HttpService } from '@nestjs/axios'
import { ExternalCeasar } from 'src/external-ceasar/entities/external-ceasar.entity'
import { User } from 'src/user/entities/user.entity'
import { firstValueFrom, map } from 'rxjs'
import { AxiosResponse } from 'axios'
import { GetCeasarDto } from 'src/ceasar/dto/get-ceasar.dto'

@Injectable()
export class CeasarService {
  constructor(
    @InjectRepository(Ceasar)
    private readonly ceasarRepository: Repository<Ceasar>,
    private axiosService: HttpService,
  ) {}

  relations: UserTypesAndUser[] = [
    'admin',
    'dsp',
    'retailer',
    'subdistributor',
    'user',
  ]

  async create({
    account_type,
    account_id,
    user,
  }: {
    account_type: UserTypesAndUser
    account_id: string
    user: User
  }) {
    const newCeasarUser: Partial<ExternalCeasar> = {
      first_name: user.first_name,
      last_name: user.last_name,
      cp_number: user.phone_number,
      email: user.email,
      role: account_type,
    }
    /**
     * TODO Replace with actual ceasar coni
     */

    const ceasar_id$ = this.axiosService
      .post('/external-ceasar', newCeasarUser)
      .pipe(map((response) => response.data as string))

    const ceasar_id = await firstValueFrom(ceasar_id$)

    /**
     * Create local record of ceasar wallet
     */
    const ceasarCreate = this.ceasarRepository.create({
      account_id,
      account_type,
      ceasar_id,
    })

    const newCeasar = await this.ceasarRepository.save(ceasarCreate)
    return this.injectExternalCeasar(newCeasar)
  }

  async findAll(
    params: GetAllCeasarDto,
  ): Promise<Paginated<Ceasar> | Ceasar[]> {
    if (!isNotEmptyObject(params)) {
      return await this.ceasarRepository
        .find({
          take: 100,
        })
        .then((res) => {
          return this.injectExternalCeasar(res)
        })
    } else {
      return await paginateFind<Ceasar>(this.ceasarRepository, params, {}).then(
        async (paginatedCeasar) => {
          const externalCeasarData = await Promise.all(
            paginatedCeasar.data.map(
              async (ceasar) =>
                this.injectExternalCeasar(ceasar) as Promise<Ceasar>,
            ),
          )
          return {
            ...paginatedCeasar,
            data: externalCeasarData,
          }
        },
      )
    }
  }

  clear() {
    if (process.env.NODE_ENV === 'development') {
      return this.ceasarRepository.clear().then(() => {
        return `Ceasar Cleared`
      })
    }
  }

  // injectCeasar<T extends Record<any, any>>(
  //   entity: T,
  //   entityType: UserTypesAndUser,
  // ): Promise<T>
  injectCeasar<T extends Record<any, any>>(
    entities: T[],
    entity: UserTypesAndUser,
  ): Promise<T[]> {
    return Promise.all(
      entities.map(async (ea) => ({
        ...ea,
        ceasar_wallet: await this.findOne({
          [entity]: ea.id,
        }).catch((err) => {
          return null
        }),
      })),
    )
  }

  //get Ceasar by account
  findOne<T = GetCeasarDto>(accountQuery: T): Promise<Ceasar>
  findOne<T = string>(ceasarId: T): Promise<Ceasar>
  findOne(id: GetCeasarDto | string) {
    if (typeof id === 'string') {
      const ceasar = this.ceasarRepository
        .findOneOrFail(id)
        .then(async (res) => {
          return await this.injectExternalCeasar(res).catch((err) => {
            // console.error(err)
            return null
          })
        })
        .catch((err) => {
          // console.error(err)
          throw new Error(err.message)
        })
      return ceasar
    } else {
      const account_type = Object.keys(id)[0] as UserTypesAndUser

      const ceasar = this.ceasarRepository
        .findOneOrFail({
          account_id: id[account_type],
          account_type,
        })
        .then(async (res) => {
          return await this.injectExternalCeasar(res).catch((err) => {
            console.error(err)
            return null
          })
        })
        .catch((err) => {
          // console.error(err)
          throw new Error(err.message)
        })
      return ceasar
    }
  }

  injectExternalCeasar<T>(localCeasar: T): Promise<T>
  injectExternalCeasar<T>(localCeasar: T[]): Promise<T[]>
  async injectExternalCeasar(localCeasar): Promise<Ceasar | Ceasar[]> {
    if (!Array.isArray(localCeasar)) {
      //TODO handle error
      const ceasarExternalData$ = this.axiosService
        .get('/external-ceasar/' + localCeasar.ceasar_id)
        .pipe(map((response: AxiosResponse) => response.data))

      const ceasarExternalData = await firstValueFrom(
        ceasarExternalData$,
      ).catch((err) => {
        throw new Error(err)
      })
      return {
        ...localCeasar,
        data: ceasarExternalData,
      }
    } else {
      return Promise.all(
        localCeasar.map(async (ceasar) => {
          return { ...(await this.injectExternalCeasar(ceasar)) }
        }),
      )
    }
  }
}
