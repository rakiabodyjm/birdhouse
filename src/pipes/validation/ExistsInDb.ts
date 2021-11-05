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
      options: {
        ...validationOptions,
        message: validationOptions?.message
          ? validationOptions.message
          : `${propertyName} doesn't exist`,
      },
      validator: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        async validate(value: any, args: ValidationArguments) {
          async function lookUp(param: any) {
            return await getConnectionManager()
              .get('default')
              .getRepository(property)
              .findOneOrFail({
                [field || args.property]: param,
              })
              .catch((err) => {
                // console.error(err)
                throw err
              })
          }
          try {
            if (typeof value === 'object' && Array.isArray(value)) {
              await Promise.all(
                value.map(async (ea) => {
                  await lookUp(ea)
                }),
              )
            } else {
              const propertyLookup = await lookUp(value)
              if (!propertyLookup) {
                return false
              }
            }
            return true
          } catch (err) {
            return false
          }
        },
      },
    })
  }
}
