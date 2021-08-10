import { ClassConstructor } from 'class-transformer'
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator'
import { getConnectionManager } from 'typeorm'

export function ExistsInDb(
  property: ClassConstructor<any>,
  /**
   * Field from entity
   */
  field: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: { [x: string]: any }, propertyName: string) {
    registerDecorator({
      name: 'existsInDb',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      // options: { ...validationOptions },
      options: validationOptions,
      validator: {
        async validate(value: any, args: ValidationArguments) {
          const entityRepositoryFindByField = await getConnectionManager()
            .get('default')
            .getRepository(property)
            .findOne(value)
            .catch((err) => {
              console.log(err)
              return false
            })
          console.log(
            'entitybyrepositoryfindbyfield',
            entityRepositoryFindByField,
          )
          // console.log(
          //   'entityRepositoryFindByField',
          //   entityRepositoryFindByField,
          // )
          if (!entityRepositoryFindByField) {
            return false
          }
          // console.log('args', args)
          return true
        },
      },
    })
  }
}
