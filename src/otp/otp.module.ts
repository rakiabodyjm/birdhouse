import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { OTP } from './entities/otp.entity'
import { OtpController } from './otp.controller'
import { OtpService } from './otp.service'

@Module({
  imports: [TypeOrmModule.forFeature([OTP])],
  controllers: [OtpController],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
