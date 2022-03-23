import { IsIn, IsNotEmpty, IsNumber, IsOptional } from 'class-validator'

export class PayActualWalletDto {
  @IsNotEmpty()
  customerId: string

  @IsNotEmpty()
  @IsNumber()
  amount: number

  @IsIn(['PHP', 'USD'])
  currency: 'PHP' | 'USD'

  // @IsNotEmpty()
  // description: string

  @IsNotEmpty()
  merchantId: string

  @IsOptional()
  postBackUrl: string
}
