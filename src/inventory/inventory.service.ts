import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { isNotEmptyObject } from 'class-validator'
import Asset from 'src/asset/entities/asset.entity'
import { Ceasar } from 'src/ceasar/entities/ceasar.entity'
import { GetAllInventoryDto } from 'src/inventory/dto/get-all-inventory.dto'
import Inventory from 'src/inventory/entities/inventory.entity'
import paginateFind from 'src/utils/paginate'
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

  create(createInventoryDto: {
    quantity: number
    asset: Asset
    ceasar: Ceasar
  }) {
    const newInventory = this.inventoryRepository.create(createInventoryDto)

    return this.inventoryRepository.save(newInventory)
  }

  findAll(paginationParams?: GetAllInventoryDto) {
    if (isNotEmptyObject(paginationParams)) {
      return paginateFind(this.inventoryRepository, paginationParams, {
        relations: this.relations,
      })
    }
    return this.inventoryRepository.find({
      relations: this.relations,
    })

    // return `This action returns all inventory`
  }

  findByAssetIdAndCeasarId({
    asset_id,
    ceasar_id,
  }: {
    asset_id: string
    ceasar_id: string
  }) {
    return this.inventoryRepository
      .findOne({
        asset: {
          id: asset_id,
        },
        ceasar: {
          id: ceasar_id,
        },
      })
      .catch((err) => {
        throw new Error(err.message)
      })
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
    return this.findOne(id)
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
