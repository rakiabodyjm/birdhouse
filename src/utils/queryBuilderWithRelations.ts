import { Repository, SelectQueryBuilder } from 'typeorm'
/**
 *
 * include relations so that you won't manually add or for a more error prone approach
 */
export default function createQueryBuilderAndIncludeRelations<T>(
  repository: Repository<T>,
  {
    entityName,
    relations,
  }: {
    entityName: string
    relations: string[]
  },
): SelectQueryBuilder<T> {
  const createdQueryBuilder = repository.createQueryBuilder(entityName)

  let withRelations
  if (relations) {
    relations.forEach((ea) => {
      if (withRelations) {
        withRelations = withRelations.leftJoinAndSelect(
          `${entityName}.${ea}`,
          ea,
        )
      } else {
        withRelations = createdQueryBuilder.leftJoinAndSelect(
          `${entityName}.${ea}`,
          ea,
        )
      }
    })
  }

  if (withRelations) {
    return withRelations
  }
  return createdQueryBuilder
}
