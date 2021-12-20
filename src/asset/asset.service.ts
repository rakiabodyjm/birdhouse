import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { GetAllAssetDto } from 'src/asset/dto/get-all-asset.dto'
import Asset from 'src/asset/entities/asset.entity'

import { Paginated } from 'src/types/Paginated'
import paginateFind from 'src/utils/paginate'
import { Like, Repository } from 'typeorm'
import { CreateAssetDto } from './dto/create-asset.dto'
import { UpdateAssetDto } from './dto/update-asset.dto'

@Injectable()
export class AssetService {
  constructor(
    @InjectRepository(Asset) protected assetRepository: Repository<Asset>,
  ) {}

  create(createAssetDto: CreateAssetDto) {
    const newAsset = this.assetRepository.create(
      createAssetDto as typeof createAssetDto & {
        approval: string
      },
    )

    return this.assetRepository.save({ ...newAsset, active: true })
  }

  findAll(params: GetAllAssetDto): Promise<Paginated<Asset> | Asset[]> {
    const { withDeleted } = params
    delete params.withDeleted
    try {
      if ('page' in params || 'limit' in params) {
        const { limit, page } = params
        delete params.page
        delete params.limit

        return paginateFind(
          this.assetRepository,
          {
            page: page,
            limit: limit,
          },
          {
            where: {
              ...params,
            },
            ...(withDeleted && {
              withDeleted: true,
            }),
          },
        )
      } else {
        return this.assetRepository.find({
          where: {
            ...params,
          },
          take: 100,
          ...(withDeleted && {
            withDeleted: true,
          }),
        })
      }
    } catch (err) {
      throw new Error(err.message)
    }
  }

  findOne(id: string) {
    return this.assetRepository
      .findOneOrFail(id, {
        withDeleted: true,
      })
      .then((asset) => asset)
      .catch((err) => {
        throw new Error(err.message)
      })
  }

  async update(id: string, updateAssetDto: UpdateAssetDto): Promise<Asset> {
    return this.assetRepository
      .findOneOrFail(id)
      .then(async (asset) => {
        const updatedAsset = {
          ...asset,
          ...(updateAssetDto as UpdateAssetDto & {
            approval: string
          }),
        }
        return await this.assetRepository.save(updatedAsset)
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

  unDelete(id: string) {
    return this.findOne(id)
  }
  search(
    searchQuery: string,
    options?: {
      withDeleted?: true
    },
  ) {
    const { withDeleted } = options
    const likeSearchQuery = Like(`%${searchQuery}%`)
    return this.assetRepository
      .find({
        where: [
          {
            name: likeSearchQuery,
          },
          {
            code: likeSearchQuery,
          },
          {
            description: likeSearchQuery,
          },
        ],
        withDeleted,
        take: 100,
      })
      .catch((err) => {
        throw new Error(err.message)
      })
  }
}
