import { ClassConstructor } from 'class-transformer'
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { getConnectionManager } from 'typeorm'

@ValidatorConstraint({ async: false })
export class NoDuplicateInDbConstraints
  implements ValidatorConstraintInterface
{
  async validate(incomingValue: string, args: ValidationArguments) {
    args.constraints as [ClassConstructor<any>, string | string[]]
    const [Class, columnName] = args.constraints
    const searchForDuplicate = await getConnectionManager()
      .get('default')
      .getRepository(Class)
      .findOne({
        [columnName || args.property]: incomingValue,
      })
      .catch((err) => {
        console.error('Error in NoDuplicateInDbP', err)
        return null
      })
    if (searchForDuplicate) {
      return false
    }
    return true
  }
}

export function NoDuplicateInDb(
  Class: ClassConstructor<any>,
  columnName?: string | never,
  validationOptions?: ValidationOptions,
) {
  return function (object: { [x: string]: any }, propertyName: string) {
    return registerDecorator({
      name: 'noDuplicateInDb',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [Class, columnName],
      validator: NoDuplicateInDbConstraints,
    })
  }
}
