import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ErrorsInterceptor } from 'src/interceptors/error.interceptor'
import { Repository } from 'typeorm'
import { CreateOTPDto } from './dto/create-otp.dto'
import { CreateSMSDto } from './dto/create-sms.dto'
import { GetAllOTPDto } from './dto/get-otp.dto'
import { UpdateOTPDto } from './dto/update-otp.dto'
import { OTP } from './entities/otp.entity'
import { OtpService } from './otp.service'

@Controller('otp')
@UseInterceptors(ErrorsInterceptor, ClassSerializerInterceptor)
export class OtpController {
  constructor(
    private readonly otpService: OtpService,
    @InjectRepository(OTP)
    private otpRepository: Repository<OTP>,
  ) {}

  @Post()
  async create(@Body() createOTP: CreateOTPDto) {
    try {
      const otp = await this.otpService.create({ ...createOTP })
      return {
        message: 'OTP Sent',
        otp: otp,
      }
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST)
    }
  }

  // @Post('sms')
  // async createSMS(@Body() createSMS: CreateSMSDto) {
  //   try {
  //     const sms = await this.otpService.createSMS({ ...createSMS })
  //     return sms
  //   } catch (err) {
  //     throw new HttpException(err.message, HttpStatus.BAD_REQUEST)
  //   }
  // }

  @Patch('/verify/:id')
  async verify(@Param('id') id: string, @Body() updateOTP: UpdateOTPDto) {
    try {
      const otp = await this.otpService.verify(id, updateOTP)
      return {
        message: 'OTP Verified',
        otp: otp,
      }
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOTP: UpdateOTPDto) {
    return this.otpService.update(id, updateOTP)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.otpService.findOne(id)
  }

  @Get()
  findAll(@Query() getAllOTPDto: GetAllOTPDto) {
    return this.otpService.findAll(getAllOTPDto)
  }
}
