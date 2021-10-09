import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common'
import { ClassConstructor } from 'class-transformer'
import { Admin } from 'src/admin/entities/admin.entity'
import { Dsp } from 'src/dsp/entities/dsp.entity'
import { CreateUserDto } from 'src/user/dto/create-user.dto'
import { UpdateUserDto } from 'src/user/dto/update-user.dto'
import { getConnectionManager } from 'typeorm'

/**
 * User Transformer transforms password as bcryptGeneratedPassword
 * Gets DSP entity from DB based on the body parameter dsp
 * Gets Admin entity from DB based on the body parameter admin
 */

@Injectable()
export class UserTransformer implements PipeTransform {
  getEntity(Entity: ClassConstructor<any>, id: any) {
    return getConnectionManager()
      .get('default')
      .getRepository(Entity)
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
      /**
       * if existing DSP account is added into user account
       */
      if (typeof returnValue.dsp === 'string') {
        returnValue.dsp = await this.getEntity(Dsp, returnValue.dsp)
      }
      /**
       * if existing Admin Account is added into user account
       */
      if (typeof returnValue.admin === 'string') {
        returnValue.admin = await this.getEntity(Admin, returnValue.admin)
      }

      // if (
      //   typeof returnValue.dsp.area_id === 'object' &&
      //   Array.isArray(returnValue.dsp.area_id)
      // ) {
      //   const areaIds = returnValue.dsp.area_id
      //   returnValue.dsp.area_id = await Promise.all(
      //     areaIds.map((ea) => {
      //       return this.getEntity()
      //     }),
      //   )
      // }
    }

    return returnValue
  }
}
