import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Paginated } from 'src/types/Paginated'
import { GetAllUserDto } from 'src/user/dto/get-all-user.dto'
import { User } from 'src/user/entities/user.entity'
import { UserRoles } from 'src/user/types/UserRoles'
import paginateFind from 'src/utils/paginate'
import { SQLDateGenerator } from 'src/utils/SQLDateGenerator'
import { Like, Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { isNotEmptyObject } from 'class-validator'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
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
    // const [, total] = await this.userRepository.findAndCount()
    // const page = params?.page || 0
    // const limit = params?.limit || 100
    // const total_page = Math.ceil(total / limit)
    if (!isNotEmptyObject(params)) {
      return await this.userRepository.find({
        relations: ['dsp', 'admin'],
      })
    } else {
      return paginateFind<User>(this.userRepository, params, {
        relations: ['dsp', 'admin'],
      })
    }
    // const users = await this.userRepository.find({
    //   relations: ['dsp', 'admin'],
    // })
    // return {
    //   data: users,
    //   metadata: {
    //     total_page,
    //     limit,
    //     page,
    //     total,
    //   },
    // }
  }

  async findOne(id: string): Promise<User> {
    // return await this.userRepository.findByIds([id])[0]
    return await this.userRepository.findOne(id, {
      relations: ['dsp'],
    })
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto | Partial<UpdateUserDto>,
  ): Promise<User> {
    const userQuery: User = await this.userRepository.findOne(id, {
      relations: ['dsp'],
    })

    if (!userQuery) {
      console.log('User Query', userQuery)
      throw new Error('User not found')
    }
    const updatedUser: User = {
      ...userQuery,
      ...updateUserDto,
      // updated_at: new Date(new SQLDateGenerator().timeNow().getSQLDate()),
      updated_at: new SQLDateGenerator().timeNow().getSQLDateObject(),
    }
    const user = await this.userRepository.save(updatedUser)
    return user
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

  async removeRole(id: string, roles: UserRoles[]) {
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
    const roleKeys: UserRoles[] = ['dsp']

    const user = await this.userRepository.findOne(id, {
      relations: roleKeys,
    })

    console.log('user', user)

    // const roles: Record<UserRoles, any>[] = []
    const roles: UserRoles[] = []
    roleKeys.forEach((ea) => {
      if (user[ea]) {
        // const toPush = {
        //   [ea]: user.id,
        // }

        // roles.push(toPush as Record<UserRoles, string>)
        roles.push(ea)
      }
    })

    return roles
  }
}
