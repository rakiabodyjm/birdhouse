import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Paginated } from 'src/types/Paginated'
import { GetAllUserDto } from 'src/user/dto/get-all-user.dto'
import { User } from 'src/user/entities/user.entity'
import { Roles, UserTypes } from 'src/types/Roles'
import paginateFind from 'src/utils/paginate'
import { Like, Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { isNotEmptyObject } from 'class-validator'
import { Cache } from 'cache-manager'

//TODO replace relations array with Roles type array if module 'retailer' cerated

//TODO fix entities (DSP Retailer ADMIN) default updated_at values
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const userSearch = await this.userRepository.findOne({
      email: createUserDto.email,
    })
    if (userSearch) {
      throw new Error('Email already taken')
    }

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
      if (userCache) {
        if (isCached === true) {
          return userCache
        } else {
          this.cacheManager.del(id)
        }
      }

      const user = await this.userRepository.findOneOrFail(id, {})

      this.cacheManager.set(user.id, user, {
        ttl: 10 * 60 * 1000,
      })
      return user
    } catch (err) {
      throw new Error(err.message)
    }
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
        {},
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
}
