import { instanceToPlain } from 'class-transformer'
import { ArgumentMetadata, PipeTransform } from '@nestjs/common'
export class CashTransferOneSourceOneDestinationPipe implements PipeTransform {
  transform(value: any, data: ArgumentMetadata) {
    // console.log(instanceToPlain(value), metadata)
    const obj = instanceToPlain(value)
    /**
     * only one source
     */

    if (obj.from && obj.caesar_bank_from) {
      throw new Error(`There should only be one source account`)
    }
    /**
     * only one destination
     */
    if (obj.to && obj.caesar_bank_to) {
      throw new Error(`There should only be one destination account`)
    }
    return value
  }
}
