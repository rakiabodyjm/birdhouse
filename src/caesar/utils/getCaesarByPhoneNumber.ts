import { Caesar } from 'src/caesar/entities/caesar.entity'
import { FindManyOptions, FindOperator } from 'typeorm'

export const caesarPhoneNumberQuery = (
  searchString: FindOperator<string>,
  additionalParams?: FindManyOptions<Caesar>,
): FindManyOptions<Caesar>['where'] => {
  return [
    {
      retailer: {
        e_bind_number: searchString,
        ...additionalParams,
      },
    },
    {
      subdistributor: {
        e_bind_number: searchString,
        ...additionalParams,
      },
    },
    {
      dsp: {
        e_bind_number: searchString,
        ...additionalParams,
      },
    },
    {
      user: {
        phone_number: searchString,
        ...additionalParams,
      },
    },
  ]
}
