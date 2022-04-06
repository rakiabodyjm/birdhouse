import { Paginated, PaginateOptions } from 'src/types/Paginated'
import { FindManyOptions, Repository } from 'typeorm'

export default async function paginateFind<T>(
  repository: Repository<T>,
  options: PaginateOptions,
  findOptions?: FindManyOptions<T>,
  mutateData?: (param: T[]) => T[] | Promise<T[]>,
): Promise<Paginated<T>> {
  const page = options?.page || 0
  const limit = options?.limit || 100

  const [data, total] = await repository.findAndCount({
    ...findOptions,
    take: limit,
    skip: page * limit,
  })

  const total_page = Math.ceil(total / limit)

  return {
    data: await (mutateData ? mutateData(data) : data),
    metadata: {
      limit,
      page,
      total,
      total_page,
    },
  }
}
