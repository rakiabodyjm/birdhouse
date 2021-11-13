import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import Inventory from 'src/inventory/entities/inventory.entity'
import { Repository } from 'typeorm'
import { CreateInventoryDto } from './dto/create-inventory.dto'
import { UpdateInventoryDto } from './dto/update-inventory.dto'

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
  ) {
    this.relations = ['ceasar', 'asset']
  }
  relations: string[]
  create(createInventoryDto: CreateInventoryDto) {
    const newInventory = this.inventoryRepository.create(createInventoryDto)
    return this.inventoryRepository.save(newInventory)
  }

  findAll() {
    return this.inventoryRepository.find({
      relations: this.relations,
    })
    // return `This action returns all inventory`
  }

  findOne(id: string) {
    return this.inventoryRepository.findOneOrFail(
      {
        id,
      },
      {
        relations: this.relations,
      },
    )
  }

  update(id: string, updateInventoryDto: UpdateInventoryDto) {
    return this.inventoryRepository
      .findOneOrFail(
        { id },
        {
          relations: this.relations,
        },
      )
      .then((inventory) => {
        return this.inventoryRepository.save({
          ...inventory,
          ...updateInventoryDto,
        })
      })
      .catch((err) => {
        throw new Error(err.message)
      })
  }

  remove(id: string) {
    return this.inventoryRepository
      .findOneOrFail(
        { id },
        {
          relations: this.relations,
        },
      )
      .then(async (res) => {
        await this.inventoryRepository.delete({
          id: res.id,
        })
        return res
      })
  }

  clear() {
    return this.inventoryRepository.clear()
  }
  // remove(id: number) {
  //   return `This action removes a #${id} inventory`
  // }
}
