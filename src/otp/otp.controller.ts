import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ErrorsInterceptor } from 'src/interceptors/error.interceptor'
import { Repository } from 'typeorm'
import { CreateOTPDto } from './dto/create-otp.dto'
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
  create(@Body() createOTP: CreateOTPDto) {
    return this.otpService.create(createOTP)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOTP: UpdateOTPDto) {
    return this.otpService.update(id, updateOTP)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.otpService.findOne(id)
  }
}
