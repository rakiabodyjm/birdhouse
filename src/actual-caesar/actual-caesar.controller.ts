import {
  BadGatewayException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common'
import { Public } from 'src/auth/decorators/public.decorator'
import { ActualCaesarService } from './actual-caesar.service'
import { CreateActualWalletDto } from './dto/create-actual-wallet.dto'
import { PayActualWalletDto } from './dto/pay-actual-wallet.dto'

@Public()
@Controller('actual-caesar')
export class ActualCaesarController {
  constructor(private readonly actualCaesarService: ActualCaesarService) {}

  @Post('create-wallet')
  createWallet(@Body() caesarParams: CreateActualWalletDto) {
    return this.actualCaesarService
      .createWallet(caesarParams)
      .then((res) => {
        console.log('response in controller', res)
      })
      .catch((err) => {
        throw new BadGatewayException(err.message)
      })
  }

  @Delete('reset-data')
  resetData() {
    return this.actualCaesarService.resetData()
  }

  @Get('user-info/:walletId')
  getUserInfo(@Param('walletId') walletId: string) {
    return this.actualCaesarService
      .getUserInfo(walletId)
      .then((res) => {
        console.log('response', res)
        return res
      })
      .catch((err) => {
        throw new BadGatewayException(err.message)
      })
  }

  @Post('pay')
  getPaymentUi(@Body() bodyParams: PayActualWalletDto) {
    return this.actualCaesarService.getPaymentUi(bodyParams)
  }
}
