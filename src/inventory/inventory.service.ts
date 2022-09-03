import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToClass } from 'class-transformer'
import { isNotEmptyObject } from 'class-validator'
import Asset from 'src/asset/entities/asset.entity'
import { CaesarService } from 'src/caesar/caesar.service'
import { Caesar } from 'src/caesar/entities/caesar.entity'
import { GetAllInventoryDto } from 'src/inventory/dto/get-all-inventory.dto'
import Inventory from 'src/inventory/entities/inventory.entity'
import { PaginateOptions } from 'src/types/Paginated'
import paginateFind from 'src/utils/paginate'
import { FindManyOptions, IsNull, Not, Repository } from 'typeorm'

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    private readonly caesarService: CaesarService,
    @InjectRepository(Caesar)
    private readonly caesarRepository: Repository<Caesar>,
  ) {
    this.relations = ['caesar', 'asset']
  }
  relations: string[]

  /**
   *
   * create method already handles duplicate entry for inventoryService
   */
  async create({
    quantity,
    asset,
    caesar,
    unit_price: unitPriceParam,
  }: {
    quantity: number
    asset: Asset
    caesar: Caesar
    unit_price?: number
  }) {
    /**
     * if inventory already exists
     */
    const duplicateInventory = await this.findByAssetIdAndCaesarId({
      asset_id: asset.id,
      caesar_id: caesar.id,
    }).catch((err) => {
      return null
    })

    if (duplicateInventory) {
      return this.update(duplicateInventory.id, {
        ...duplicateInventory,
        quantity: duplicateInventory.quantity + quantity,
      })
    }

    const {
      description,
      name,
      srp_for_dsp,
      srp_for_retailer,
      srp_for_subd,
      srp_for_user,
      unit_price,
    } = asset

    if (asset.whole_number_only && quantity % 1 > 0) {
      throw new Error(`This Inventory only accepts whole number quantities`)
    }
    const newInventory = this.inventoryRepository.create({
      active: true,
      asset,
      caesar,
      name,
      description,
      srp_for_dsp,
      srp_for_retailer,
      srp_for_subd,
      srp_for_user,
      unit_price: unitPriceParam || unit_price,
      quantity,
    })

    return this.inventoryRepository.save(newInventory).catch((err) => {
      throw new Error(err)
    })
  }

  async findAll(getAllInventoryDto?: GetAllInventoryDto) {
    const paginationParams: PaginateOptions = {
      limit: getAllInventoryDto['limit'],
      page: getAllInventoryDto['page'],
    }
    delete getAllInventoryDto.limit
    delete getAllInventoryDto.page

    /**
     * Account Only query
     */
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
    }, {} as Partial<Record<'user' | 'admin' | 'subdistributor' | 'dsp' | 'retailer', string>>)

    let caesarAccount: Caesar

    try {
      if (isNotEmptyObject(accountQuery)) {
        caesarAccount = await this.caesarService
          .findOne(accountQuery)
          .catch((err) => {
            throw new Error(`Caesar account doesn't exist for this account`)
          })
      }
    } catch (err) {
      throw new Error(err.message)
    }

    const whereQuery = {
      ...(caesarAccount && {
        caesar: caesarAccount.id,
      }),
      ...('active' in getAllInventoryDto && {
        active: getAllInventoryDto.active,
      }),
      ...('asset' in getAllInventoryDto && {
        asset: {
          id: getAllInventoryDto.asset,
        },
      }),
    }

    if (isNotEmptyObject(paginationParams)) {
      return paginateFind(this.inventoryRepository, paginationParams, {
        relations: this.relations,
        where: whereQuery,
      })
    }
    return this.inventoryRepository.find({
      relations: this.relations,
      where: whereQuery,
    })

    // return `This action returns all inventory`
  }

  /**
   * Does not throw an exception when nothing found
   */
  findByAssetIdAndCaesarId({
    asset_id,
    caesar_id,
  }: {
    asset_id: string
    caesar_id: string
  }) {
    return this.inventoryRepository
      .findOne({
        asset: {
          id: asset_id,
        },
        caesar: {
          id: caesar_id,
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

  async update(id: string, updateInventoryDto: Partial<Inventory>) {
    // const updateInventoryDto = {
    //   ...updateInventoryDtoParam,
    // }
    return this.findOne(id)
      .then(async (inventory) => {
        if (
          inventory.asset.whole_number_only &&
          updateInventoryDto.quantity % 1 > 0
        ) {
          throw new Error(`This Inventory only accepts whole number quantities`)
        }
        return plainToClass(
          Inventory,
          await this.inventoryRepository.save({
            ...inventory,
            ...updateInventoryDto,
          }),
        )
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

  async getCommerce(caesar: Caesar['id'], paginateOptions: PaginateOptions) {
    const { account_id, account_type } = await this.caesarService.findOne(
      caesar,
    )

    const buyerCaesar = await this.caesarRepository.findOneOrFail(caesar, {
      relations: [
        'dsp',
        'dsp.subdistributor',
        'retailer',
        'retailer.dsp',
        'retailer.subdistributor',
      ],
    })
    let query: FindManyOptions<Inventory> = {
      where: {
        caesar: {
          id: Not(buyerCaesar.id),
        },
      },
    }
    switch (account_type) {
      case 'retailer': {
        query = {
          where: [
            {
              caesar: {
                dsp: buyerCaesar.retailer.dsp,
              },
            },
            {
              caesar: {
                subdistributor: buyerCaesar.retailer.subdistributor,
              },
            },
          ],
        }
        break
      }
      case 'dsp': {
        query = {
          where: [
            /**
             * include subdistributor of dsp
             */
            {
              caesar: {
                subdistributor: {
                  id: buyerCaesar.dsp.subdistributor.id,
                },
              },
            },
            /**
             * include admin
             */
            // {
            //   caesar: {
            //     admin: Not(IsNull()),
            //   },
            // },
          ],
        }

        // inventory = paginateFind(paginateOptions, )
        break
      }

      case 'subdistributor': {
        query = {
          where: [
            {
              caesar: {
                admin: Not(IsNull()),
              },
            },
          ],
        }
        break
      }
    }

    query = {
      ...query,

      relations: [
        'caesar',
        'caesar.subdistributor',
        'caesar.retailer',
        'caesar.admin',
        'caesar.user',
        'caesar.dsp',
      ].filter((relation, index, array) => array.indexOf(relation) === index),
    }
    if (paginateOptions.limit || paginateOptions.page) {
      return paginateFind(this.inventoryRepository, paginateOptions, query)
    }
    return this.inventoryRepository.find(query)
    // return buyerCaesar
  }
}

const promise = async function (parameter?) {
  if (!parameter) {
    throw new Error(`parameter not provided`)
  }
  return 'hi'
}
