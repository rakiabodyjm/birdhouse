import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common'
import { Bcrypt } from 'src/utils/Bcrypt'

@Injectable()
export class UserPasswordTransformer implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // console.log('value', value)

    if (metadata.type === 'body' && value.password) {
      value.password = Bcrypt().generatePassword(value.password)
    }
    return value
  }
}
