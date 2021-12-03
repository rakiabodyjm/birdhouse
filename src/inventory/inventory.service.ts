import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { isNotEmptyObject } from 'class-validator'
import Asset from 'src/asset/entities/asset.entity'
import { CeasarService } from 'src/ceasar/ceasar.service'
import { Ceasar } from 'src/ceasar/entities/ceasar.entity'
import { GetAllInventoryDto } from 'src/inventory/dto/get-all-inventory.dto'
import Inventory from 'src/inventory/entities/inventory.entity'
import { PaginateOptions } from 'src/types/Paginated'
import paginateFind from 'src/utils/paginate'
import { Repository } from 'typeorm'
import { UpdateInventoryDto } from './dto/update-inventory.dto'

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    private readonly ceasarService: CeasarService,
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

  async findAll(getAllInventoryDto?: GetAllInventoryDto) {
    const paginationParams: PaginateOptions = {
      limit: getAllInventoryDto['limit'],
      page: getAllInventoryDto['page'],
    }
    delete getAllInventoryDto.limit
    delete getAllInventoryDto.page

    const accountQuery = [
      'user',
      'admin',
      'subdistributor',
      'dsp',
      'retailer',
    ].reduce((acc, ea) => {
      if (isNotEmptyObject(acc)) {
        return acc
      }
      if (getAllInventoryDto[ea]) {
        return {
          [ea]: getAllInventoryDto[ea],
        }
      } else {
        return null
      }
    }, {})

    let ceasarAccount: Ceasar

    try {
      if (isNotEmptyObject(accountQuery)) {
        ceasarAccount = await this.ceasarService
          .findOne(accountQuery)
          .catch((err) => {
            throw new Error(`Ceasar account doesn't exist for this account`)
          })
      }
    } catch (err) {
      throw new Error(err.message)
    }

    if (isNotEmptyObject(paginationParams)) {
      return paginateFind(this.inventoryRepository, paginationParams, {
        relations: this.relations,
        where: {
          ...(ceasarAccount && {
            ceasar: ceasarAccount.id,
          }),
        },
      })
    }
    return this.inventoryRepository.find({
      relations: this.relations,
      where: {
        ...(ceasarAccount && {
          ceasar: ceasarAccount.id,
        }),
      },
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
