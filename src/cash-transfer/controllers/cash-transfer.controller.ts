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
  HttpException,
  HttpStatus,
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
import { v4 } from 'uuid'

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
  @Get('ref/:id')
  findByRef(@Param('id') ref_num: string) {
    return this.cashTransferService.findByCTID(ref_num)
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
  async transfer(@Body() createCashTransferDto: CreateCashTransferDto) {
    try {
      const ref_num = createCashTransferDto.ref_num
      const date = new Date()
      const month = date.getMonth() + 1
      const fileNameExt =
        date.getFullYear().toString().substring(2, 4) +
        month.toString().padStart(2, '0') +
        date.getDate().toString().padStart(2, '0')

      const uuidTag: string = v4().split('-')[4].toUpperCase()
      const duplicateID = await this.cashTransferService.findByCTID(ref_num)

      if (duplicateID) {
        createCashTransferDto.ref_num = fileNameExt + '-TF-' + uuidTag
      } else {
        createCashTransferDto.ref_num = fileNameExt + '-TF-' + uuidTag
      }

      const transfer = await this.cashTransferService.transfer({
        ...createCashTransferDto,
      })
      return {
        message: 'Transfer Successful',
        transfer: transfer,
      }
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Post('withdraw')
  async withdraw(@Body() createCashTransferDto: CreateCashTransferDto) {
    // return this.cashTransferService.withdraw({
    //   ...createCashTransferDto,
    // })
    try {
      const ref_num = createCashTransferDto.ref_num
      const date = new Date()
      const month = date.getMonth() + 1
      const fileNameExt =
        date.getFullYear().toString().substring(2, 4) +
        month.toString().padStart(2, '0') +
        date.getDate().toString().padStart(2, '0')

      const uuidTag: string = v4().split('-')[4].toUpperCase()
      const duplicateID = await this.cashTransferService.findByCTID(ref_num)

      if (duplicateID) {
        createCashTransferDto.ref_num = fileNameExt + '-WD-' + uuidTag
      } else {
        createCashTransferDto.ref_num = fileNameExt + '-WD-' + uuidTag
      }

      const withdraw = await this.cashTransferService.withdraw({
        ...createCashTransferDto,
      })
      return {
        message: 'Withdraw Successful',
        withdraw: withdraw,
      }
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Post('deposit')
  async deposit(@Body() createCashTransferDto: CreateCashTransferDto) {
    try {
      const ref_num = createCashTransferDto.ref_num
      const date = new Date()
      const month = date.getMonth() + 1
      const fileNameExt =
        date.getFullYear().toString().substring(2, 4) +
        month.toString().padStart(2, '0') +
        date.getDate().toString().padStart(2, '0')

      const uuidTag: string = v4().split('-')[4].toUpperCase()
      const duplicateID = await this.cashTransferService.findByCTID(ref_num)

      if (duplicateID) {
        createCashTransferDto.ref_num = fileNameExt + '-DP-' + uuidTag
      } else {
        createCashTransferDto.ref_num = fileNameExt + '-DP-' + uuidTag
      }

      const deposit = await this.cashTransferService.deposit({
        ...createCashTransferDto,
      })
      return {
        message: 'Deposit Successful',
        deposit: deposit,
      }
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Post('loan')
  async loan(@Body() createCashTransferDto: CreateCashTransferDto) {
    try {
      const ref_num = createCashTransferDto.ref_num
      const date = new Date()
      const month = date.getMonth() + 1
      const fileNameExt =
        date.getFullYear().toString().substring(2, 4) +
        month.toString().padStart(2, '0') +
        date.getDate().toString().padStart(2, '0')

      const uuidTag: string = v4().split('-')[4].toUpperCase()
      const duplicateID = await this.cashTransferService.findByCTID(ref_num)

      if (duplicateID) {
        createCashTransferDto.ref_num = fileNameExt + '-LN-' + uuidTag
      } else {
        createCashTransferDto.ref_num = fileNameExt + '-LN-' + uuidTag
      }

      const loan = await this.cashTransferService.loan({
        ...createCashTransferDto,
      })
      return {
        message: 'Loan Successful',
        loan: loan,
      }
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Post('loan-payment')
  async loanPayment(@Body() createLoanPayment: CreateLoanPaymentDto) {
    try {
      const ref_num = createLoanPayment.ref_num
      const date = new Date()
      const month = date.getMonth() + 1
      const fileNameExt =
        date.getFullYear().toString().substring(2, 4) +
        month.toString().padStart(2, '0') +
        date.getDate().toString().padStart(2, '0')

      const uuidTag: string = v4().split('-')[4].toUpperCase()
      const duplicateID = await this.cashTransferService.findByCTID(ref_num)

      if (duplicateID) {
        createLoanPayment.ref_num = fileNameExt + '-LP-' + uuidTag
      } else {
        createLoanPayment.ref_num = fileNameExt + '-LP-' + uuidTag
      }

      const loanPayment = await this.cashTransferService.loanPayment({
        ...createLoanPayment,
      })
      return {
        message: 'Loan Payment Successful',
        loanPayment: loanPayment,
      }
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST)
    }
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
