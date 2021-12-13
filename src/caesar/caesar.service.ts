import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { isNotEmptyObject } from 'class-validator'
import { GetAllCaesarDto } from 'src/caesar/dto/get-all-caesar.dto'
import { Caesar } from 'src/caesar/entities/caesar.entity'
import { Paginated } from 'src/types/Paginated'
import { UserTypesAndUser } from 'src/types/Roles'
import paginateFind from 'src/utils/paginate'
import { Repository } from 'typeorm'
import { HttpService } from '@nestjs/axios'
import { User } from 'src/user/entities/user.entity'
import { firstValueFrom, map } from 'rxjs'
import { AxiosResponse } from 'axios'
import { GetCaesarDto } from 'src/caesar/dto/get-caesar.dto'
import { ExternalCeasar } from 'src/external-ceasar/entities/external-ceasar.entity'

@Injectable()
export class CaesarService {
  constructor(
    @InjectRepository(Caesar)
    private readonly caesarRepository: Repository<Caesar>,
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
    const newCaesarUser: Partial<ExternalCeasar> = {
      first_name: user.first_name,
      last_name: user.last_name,
      cp_number: user.phone_number,
      email: user.email,
      role: account_type,
    }
    /**
     * TODO Replace with actual caesar coni
     */

    const caesar_id$ = this.axiosService
      .post('/external-caesar', newCaesarUser)
      .pipe(map((response) => response.data as string))

    const caesar_id = await firstValueFrom(caesar_id$)

    /**
     * Create local record of caesar wallet
     */
    const caesarCreate = this.caesarRepository.create({
      account_id,
      account_type,
      caesar_id,
    })

    const newCaesar = await this.caesarRepository.save(caesarCreate)
    return this.injectExternalCaesar(newCaesar)
  }

  async findAll(
    params: GetAllCaesarDto,
  ): Promise<Paginated<Caesar> | Caesar[]> {
    if (!isNotEmptyObject(params)) {
      return await this.caesarRepository
        .find({
          take: 100,
        })
        .then((res) => {
          return this.injectExternalCaesar(res)
        })
    } else {
      return await paginateFind<Caesar>(this.caesarRepository, params, {}).then(
        async (paginatedCaesar) => {
          const externalCaesarData = await Promise.all(
            paginatedCaesar.data.map(
              async (caesar) =>
                this.injectExternalCaesar(caesar) as Promise<Caesar>,
            ),
          )
          return {
            ...paginatedCaesar,
            data: externalCaesarData,
          }
        },
      )
    }
  }

  clear() {
    if (process.env.NODE_ENV === 'development') {
      return this.caesarRepository.clear().then(() => {
        return `Caesar Cleared`
      })
    }
  }

  // injectCaesar<T extends Record<any, any>>(
  //   entity: T,
  //   entityType: UserTypesAndUser,
  // ): Promise<T>
  injectCaesar<T extends Record<any, any>>(
    entities: T[],
    entity: UserTypesAndUser,
  ): Promise<T[]> {
    return Promise.all(
      entities.map(async (ea) => ({
        ...ea,
        caesar_wallet: await this.findOne({
          [entity]: ea.id,
        }).catch((err) => {
          return null
        }),
      })),
    )
  }

  findOne<T = GetCaesarDto>(accountQuery: T): Promise<Caesar>
  findOne<T = string>(caesarId: T): Promise<Caesar>
  findOne(id: GetCaesarDto | string) {
    if (typeof id === 'string') {
      const caesar = this.caesarRepository
        .findOneOrFail(id)
        .then(async (res) => {
          return await this.injectExternalCaesar(res).catch((err) => {
            // console.error(err)
            return null
          })
        })
        .catch((err) => {
          // console.error(err)
          throw new Error(err.message)
        })
      return caesar
    } else {
      const account_type = Object.keys(id)[0] as UserTypesAndUser

      const caesar = this.caesarRepository
        .findOneOrFail({
          account_id: id[account_type],
          account_type,
        })
        .then(async (res) => {
          return await this.injectExternalCaesar(res).catch((err) => {
            console.error(err)
            return null
          })
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
      return {
        ...localCaesar,
        data: caesarExternalData,
      }
    } else {
      return Promise.all(
        localCaesar.map(async (caesar) => {
          return { ...(await this.injectExternalCaesar(caesar)) }
        }),
      )
    }
  }
}
