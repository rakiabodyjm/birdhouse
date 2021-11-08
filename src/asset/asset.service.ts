import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { clear } from 'console'
import { GetAllAssetDto } from 'src/asset/dto/get-all-asset.dto'
import Asset from 'src/asset/entities/asset.entity'

import { Paginated } from 'src/types/Paginated'
import paginateFind from 'src/utils/paginate'
import { Repository } from 'typeorm'
import { CreateAssetDto } from './dto/create-asset.dto'
import { UpdateAssetDto } from './dto/update-asset.dto'

@Injectable()
export class AssetService {
  constructor(
    @InjectRepository(Asset) protected assetRepository: Repository<Asset>,
  ) {}

  create(createAssetDto: CreateAssetDto) {
    const newAsset = this.assetRepository.create(createAssetDto)

    return this.assetRepository.save({ ...newAsset, active: true })
  }

  findAll(params: GetAllAssetDto): Promise<Paginated<Asset> | Asset[]> {
    try {
      if ('page' in params || 'limit' in params) {
        const { limit, page } = params

        return paginateFind(this.assetRepository, {
          page: page,
          limit: limit,
        })
      } else {
        return this.assetRepository.find({
          where: {
            ...params,
          },
          take: 100,
        })
      }
    } catch (err) {
      throw new Error(err.message)
    }
  }

  findOne(id: string) {
    return this.assetRepository
      .findOneOrFail(id)
      .then((asset) => asset)
      .catch((err) => {
        throw new Error(err.message)
      })
  }

  update(id: string, updateAssetDto: UpdateAssetDto) {
    return this.assetRepository
      .findOneOrFail(id)
      .then(async (asset) => {
        const updatedAsset = {
          ...asset,
          ...updateAssetDto,
        }
        return this.assetRepository.save(updatedAsset)
      })
      .catch((err) => {
        throw new Error(err)
      })
  }

  remove(id: string): Promise<Asset> {
    return this.assetRepository
      .findOneOrFail(id)
      .then(async (res) => {
        await this.assetRepository.delete(id)
        return res
        // return createEntityMessage(res, `Asset ${res.id} deleted`)
      })
      .catch((err) => {
        throw new Error(err)
      })
  }

  clear() {
    return this.assetRepository
      .clear()
      .then((res) => {
        return res
      })
      .catch((err) => {
        throw new Error(err.message)
      })
  }

  softDelete(id) {
    return this.findOne(id)
      .then((ent) => {
        return this.assetRepository
          .softDelete(id)
          .then((res) => {
            return ent
          })
          .catch((err) => {
            throw new Error(err.message)
          })
      })
      .catch((err) => {
        throw new Error(err.message)
      })
  }
}
