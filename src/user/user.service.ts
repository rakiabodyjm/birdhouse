import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Paginated } from 'src/types/Paginated'
import { GetAllUserDto } from 'src/user/dto/get-all-user.dto'
import { User } from 'src/user/entities/user.entity'
import { UserTypes } from 'src/user/types/UserTypes'
import paginateFind from 'src/utils/paginate'
import { SQLDateGenerator } from 'src/utils/SQLDateGenerator'
import { Like, Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { isNotEmptyObject } from 'class-validator'
import { Cache } from 'cache-manager'
import { classToPlain, plainToClass } from 'class-transformer'

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

  async findOne(id: string): Promise<User> {
    /**
     * apply caching since Authentication also relies on user data
     */

    const userCache: User = await this.cacheManager.get(id)
    if (userCache) {
      return userCache
    }

    try {
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
    userQuery.updated_at = new SQLDateGenerator().timeNow().getSQLDateObject()

    console.log('userquery', userQuery)
    try {
      await this.userRepository.save(userQuery)
      // console.log('updateResults', updateResults)
      // return plainToClass(User, user)
      return userQuery
    } catch (err) {
      console.log(err)
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
    return await this.userRepository
      .find({
        where: fieldsToSearch.map((ea) => ({
          [ea]: Like(`%${search}%`),
        })),
      })
      .then((res) => {
        return res.slice(0, 50)
      })
  }

  async getRole(id: string) {
    const roleKeys: UserTypes[] = ['dsp', 'admin']

    const user = await this.userRepository.findOne(id, {
      relations: roleKeys,
    })

    console.log('user', user)

    // const roles: Record<UserTypes, any>[] = []
    const roles: UserTypes[] = []
    roleKeys.forEach((ea) => {
      if (user[ea]) {
        // const toPush = {
        //   [ea]: user.id,
        // }

        // roles.push(toPush as Record<UserTypes, string>)
        roles.push(ea)
      }
    })

    return roles
  }
}
