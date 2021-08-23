import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common'
import { ClassConstructor, classToPlain, plainToClass } from 'class-transformer'
import { Admin } from 'src/admin/entities/admin.entity'
import { Dsp } from 'src/dsp/entities/dsp.entity'
import { CreateUserDto } from 'src/user/dto/create-user.dto'
import { UpdateUserDto } from 'src/user/dto/update-user.dto'
import { User } from 'src/user/entities/user.entity'
import { Bcrypt } from 'src/utils/Bcrypt'
import { getConnectionManager } from 'typeorm'

@Injectable()
export class UserTransformer implements PipeTransform {
  getEntity(Class: ClassConstructor<any>, id: any) {
    return getConnectionManager()
      .get('default')
      .getRepository(Class)
      .findOne(id)
      .then((res) => res)
  }
  async transform(
    value: UpdateUserDto | CreateUserDto,
    metadata: ArgumentMetadata,
  ) {
    /**
     * avoid mutation of param
     */
    const returnValue = value
    if (metadata.type === 'body') {
      if (returnValue.password) {
        returnValue.password = Bcrypt().generatePassword(value.password)
      }
      /**
       * if DSP account is added into user account
       */
      if (returnValue.dsp) {
        returnValue.dsp = await this.getEntity(Dsp, returnValue.dsp)
      }
      /**
       * if Admin Account is added into user account
       */
      if (returnValue.admin) {
        returnValue.admin = await this.getEntity(Admin, returnValue.admin)
      }
    }
    console.log('usertransformer', returnValue)

    return returnValue
  }
}
