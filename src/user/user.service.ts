import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/user/entities/user.entity'
import { SQLDateGenerator } from 'src/utils/SQLDateGenerator'
import { Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto)
    await this.userRepository.save(user)
    return user
    // return 'This action adds a new user'
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find()
    return users
  }

  async findOne(id: string): Promise<User> {
    // return await this.userRepository.findByIds([id])[0]
    return await this.userRepository.findOne(id)
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto | Partial<UpdateUserDto>,
  ): Promise<User> {
    const userQuery: User = await this.userRepository.findOne(id)
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
    const user = await this.userRepository.findOne(id)
    const deleteResult = await this.userRepository.delete(id)
    console.log(deleteResult)
    return user
  }

  clear() {
    this.userRepository.clear()
    return {
      message: 'Users succesfully Cleared',
    }
  }
}
