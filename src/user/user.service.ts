import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Paginated } from 'src/types/Paginated'
import { GetAllUserDto } from 'src/user/dto/get-all-user.dto'
import { User } from 'src/user/entities/user.entity'
import {
  AccountTypes,
  Roles,
  UserTypes,
  UserTypesAndUser,
} from 'src/types/Roles'
import paginateFind from 'src/utils/paginate'
import { Like, Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { isNotEmptyObject } from 'class-validator'
import { Cache } from 'cache-manager'
import { GetUserDtoQuery } from 'src/user/dto/get-user-query.dto'
import { DspService } from 'src/dsp/dsp.service'
import { AdminService } from 'src/admin/admin.service'
import { RetailersService } from 'src/retailers/retailers.service'
import { SubdistributorService } from 'src/subdistributor/subdistributor.service'

interface AccountRetrieve extends Record<UserTypes, any> {
  dsp: DspService
  admin: AdminService
  retailer: RetailersService
  subdistributor: SubdistributorService
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject(DspService) private dspService: DspService,
    @Inject(AdminService) private adminService: AdminService,
    @Inject(RetailersService) private retailerService: RetailersService,
    @Inject(SubdistributorService)
    private subdistributorService: SubdistributorService,
  ) {}

  accountRetrieve: AccountRetrieve = {
    dsp: this.dspService,
    admin: this.adminService,
    retailer: this.retailerService,
    subdistributor: this.subdistributorService,
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    // const userSearch = await this.userRepository.findOne({
    //   email: createUserDto.email,
    // })
    // if (userSearch) {
    //   throw new Error('Email already taken')
    // }

    const user = this.userRepository.create(createUserDto)
    await this.userRepository.save(user)
    return user
    // return 'This action adds a new user'
  }

  async findAll(
    params?: GetAllUserDto,
  ): Promise<User[] | Promise<Paginated<User>>> {
    if (!isNotEmptyObject(params)) {
      return await this.userRepository.find({
        // relations: ['dsp', 'admin'],
      })
    } else {
      return await paginateFind<User>(this.userRepository, params, {
        // relations: ['dsp', 'admin'],
      })
    }
  }

  async findOne(id: string, isCached?: boolean): Promise<User> {
    /**
     * apply caching since Authentication also relies on user data
     */

    try {
      const userCache: User = await this.cacheManager.get(id)

      if (userCache && !isCached) {
        if (isCached === true) {
          return userCache
        } else {
          this.cacheManager.del(id)
        }
      }

      const user = await this.userRepository
        .findOneOrFail({
          id,
        })
        .catch((err) => {
          throw new Error(err.message)
        })

      this.cacheManager.set(user.id, user, {
        ttl: 10 * 60 * 1000,
      })
      return user
    } catch (err) {
      throw new Error(err.message)
    }
  }

  // async findOneQuery(params: GetUserDtoQuery) {
  //   const accountTypeKeys = <Array<keyof GetUserDtoQuery & string>>(
  //     Object.keys(params)
  //   )

  //   if (accountTypeKeys.length === 0) {
  //     throw new Error(
  //       'Must have one of the following queries: ' +
  //         'user, ' +
  //         RolesArray.join(', '),
  //     )
  //   }

  //   if (accountTypeKeys.length > 1) {
  //     throw new Error('Must only have one query from: ' + RolesArray)
  //   }
  //   const accountType = accountTypeKeys[0]

  //   try {
  //     if (accountType !== 'user') {
  //       const account = await this.accountRetrieve[accountType].findOne(
  //         params[accountType],
  //       )
  //       if (!account.user) {
  //         throw new Error(`Account has no User`)
  //       }
  //       return this.findOne(account.user.id)
  //     } else {
  //       return this.findOne(params[accountType])
  //     }
  //   } catch (err) {
  //     console.error(err)
  //     throw new Error(err)
  //   }
  // }

  async findOneQuery(params: GetUserDtoQuery): Promise<User> {
    const accountKeys: UserTypesAndUser[] = [
      'subdistributor',
      'admin',
      'retailer',
      'dsp',
      'user',
    ]
    if (Object.keys(params).length === 0) {
      throw new Error(
        `Must have one of the following queries: ${Object.keys(
          GetUserDtoQuery,
        )}`,
      )
    }
    let account: User
    await Promise.all(
      accountKeys.map(async (accountType) => {
        if (params[accountType]) {
          account =
            accountType !== 'user'
              ? await this.accountRetrieve[accountType]
                  .findOne(params[accountType])
                  .then((res: Exclude<AccountTypes, User>) =>
                    this.findOne(res.user.id),
                  )
                  .then((res) => {
                    return res
                  })
              : await this.findOne(params[accountType])
        }
      }),
    )
    if (!account) {
      throw new Error('UserService.findOneQuery error account not found')
    }
    return account
  }
  async update(
    id: string,
    updateUserDto: UpdateUserDto | Partial<UpdateUserDto>,
  ): Promise<User> {
    const userQuery: User = await this.userRepository.findOne(id, {
      // relations: ['dsp', 'admin'],
    })
    if (!userQuery) {
      throw new Error('User not found')
    }

    /** mutate user class to accept updateuserdto params */
    Object.keys(updateUserDto).forEach((key) => {
      userQuery[key] = updateUserDto[key]
    })

    try {
      const user = await this.userRepository.save(userQuery)
      if (await this.cacheManager.get(user.id)) {
        this.cacheManager.set(user.id, user, {
          ttl: 10 * 60 * 1000,
        })
      }

      return userQuery
    } catch (err) {
      console.log(err)
      throw new Error(err.message)
    }

    /**
     * apply plain object to class instance
     */
  }

  async delete(id: string): Promise<User> {
    const user = await this.userRepository.findOneOrFail(id)
    const deleteResult = await this.userRepository.delete(id)
    console.log(deleteResult)
    return user
  }

  async clear() {
    await this.userRepository.delete({})

    // return {
    //   message: 'Users succesfully Cleared',
    // }
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({
      username,
    })
    return user
  }
  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      email,
    })
    return user
  }

  async removeRole(id: string, roles: UserTypes[]) {
    const user = await this.userRepository.findOne(id)
    roles.forEach(async (ea) => {
      this.userRepository.save({
        ...user[ea],
        [ea]: null,
      } as Partial<User>)
    })

    const updatedUser = this.userRepository.findOne(id)
    return updatedUser
  }

  async search(search: string) {
    const fieldsToSearch = ['username', 'email', 'first_name', 'last_name']
    return await this.userRepository.find({
      take: 100,
      where: [
        ...fieldsToSearch.map((ea) => ({
          [ea]: Like(`%${search}%`),
        })),
      ],
    })
  }

  async getRole(id: string) {
    const roleKeys: UserTypes[] = Object.values(Roles)
    const user = await this.findOne(id)

    // const roles: Record<UserTypes, any>[] = []
    const roles: UserTypes[] = []
    roleKeys.forEach((ea) => {
      if (user[ea]) {
        roles.push(ea)
      }
    })

    return roles
  }

  async addCustomRole(userId: User['id'], customRoleString: string) {
    return this.findOne(userId).then((user) => {
      if (user.custom_roles) {
        user.custom_roles = JSON.stringify(
          [
            ...(JSON.parse(user.custom_roles) as string[]),
            customRoleString,
          ].filter((ea, index, array) => array.indexOf(ea) === index),
        )
      } else {
        user.custom_roles = JSON.stringify([customRoleString])
      }

      return this.userRepository.save(user)
    })
  }

  removeCustomRole(userId: User['id'], customRole: string) {
    return this.findOne(userId).then((user) => {
      if (!user.custom_roles) {
        throw new Error(`User doesn't have a custom role`)
      }
      let roles = JSON.parse(user.custom_roles) as string[]
      roles = roles.filter((ea) => ea !== customRole)

      user.custom_roles = roles.length > 0 ? JSON.stringify(roles) : null
      return this.userRepository.save(user)
      // this.userRepository.save(roles.length > 0 ?  : )
    })
  }
}
