import { CreateLoanPaymentDto } from './../dto/cash-transfer/create-loan-payment.dto'
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
  BadRequestException,
} from '@nestjs/common'
import { CashTransferService } from 'src/cash-transfer/services/cash-transfer.service'
import { CreateCashTransferDto } from 'src/cash-transfer/dto/cash-transfer/create-cash-transfer.dto'
import { UpdateCashTransferDto } from 'src/cash-transfer/dto/cash-transfer/update-cash-transfer.dto'
import { GetAllCashTransferDto } from 'src/cash-transfer/dto/cash-transfer/get-all-cash-transfer.dto'
import { ErrorsInterceptor } from 'src/interceptors/error.interceptor'
import { InjectRepository } from '@nestjs/typeorm'
import { CashTransfer } from 'src/cash-transfer/entities/cash-transfer.entity'
import { Repository } from 'typeorm'
import * as fs from 'fs'
import * as path from 'path'

@Controller('cash-transfer')
@UseInterceptors(ErrorsInterceptor, ClassSerializerInterceptor)
export class CashTransferController {
  constructor(
    private readonly cashTransferService: CashTransferService,
    @InjectRepository(CashTransfer)
    private cashTransferRepository: Repository<CashTransfer>,
  ) {}

  @Get()
  findAll(@Query() getAllCashTransfer: GetAllCashTransferDto) {
    return this.cashTransferService.findAll(getAllCashTransfer)
  }

  @Get('get-backup-files')
  getBackupFiles() {
    const pathLoc = path.resolve(process.cwd(), 'data', 'cash-transfer')

    const files = fs.readdirSync(pathLoc)

    return files
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cashTransferService.findOne(id)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCashTransferDto: UpdateCashTransferDto,
  ) {
    return this.cashTransferService.update(id, updateCashTransferDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cashTransferService.delete(id)
  }

  @Post('transfer')
  transfer(@Body() createCashTransferDto: CreateCashTransferDto) {
    return this.cashTransferService
      .transfer({
        ...createCashTransferDto,
      })
      .catch((err) => {
        throw new BadRequestException(err.message)
      })
  }

  @Post('withdraw')
  withdraw(@Body() createCashTransferDto: CreateCashTransferDto) {
    return this.cashTransferService.withdraw({
      ...createCashTransferDto,
    })
  }

  @Post('deposit')
  deposit(@Body() createCashTransferDto: CreateCashTransferDto) {
    return this.cashTransferService
      .deposit({
        ...createCashTransferDto,
      })
      .catch((err) => {
        throw new BadRequestException(err.message)
      })
  }

  @Post('loan')
  loan(@Body() CreateCashTransferDto: CreateCashTransferDto) {
    return this.cashTransferService.loan({
      ...CreateCashTransferDto,
    })
  }

  @Post('loan-payment')
  loanPayment(@Body() createLoanPayment: CreateLoanPaymentDto) {
    return this.cashTransferService.loanPayment(createLoanPayment)
  }

  @Get('loan-payments/:id')
  getLoanPayments(@Param('id') cashTransferId: string) {
    return this.cashTransferService.getLoanPayments(cashTransferId)
  }

  @Post('backupData/:name?')
  backupData(@Param('name') name?: string) {
    return this.cashTransferRepository.find().then((res) => {
      const pathLoc = path.resolve(process.cwd(), 'data', 'cash-transfer')
      if (!fs.existsSync(pathLoc)) {
        fs.mkdirSync(pathLoc)
      }
      return new Promise((resolve, rej) => {
        fs.writeFile(
          path.resolve(
            pathLoc,
            `cash-transfer-${new Date(Date.now()).getTime()}${
              name ? `-${name}` : ''
            }.json`,
          ),
          JSON.stringify(res),
          {
            encoding: 'utf-8',
          },
          (err) => {
            if (err) {
              rej(err)
            } else {
              resolve(`Success`)
            }
          },
        )
      })
    })
  }

  @Post('restoreData/:name?')
  restoreData(@Param('name') name?: string) {
    const pathLoc = path.resolve(process.cwd(), 'data', 'cash-transfer')

    // const files = fs.readdirSync(pathLoc)

    // let selected:string|null=null
    /**
     * get latest
     */
    // files.filter(ea => {

    //     const [, , , namae] = ea
    //   if (namae && name && (name === namae)) {
    //       return true
    //   } else if(!name) {

    //   }
    //   return false
    //   }).forEach(ea => {
    //     const [cash, transfer, date, namae] = ea.split('-')

    //     if(Number(date) > 0)
    //   })

    const read = fs.readFileSync(path.resolve(pathLoc, name), {
      encoding: 'utf-8',
    })

    const cashTransfersToRestore: CashTransfer[] = JSON.parse(read)
    return Promise.all(
      cashTransfersToRestore.map(async (ea) => {
        return await this.cashTransferRepository.save(ea)
      }),
    )
  }
}
