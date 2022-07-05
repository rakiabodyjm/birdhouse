import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { TypeOrmModule } from '@nestjs/typeorm'
import { OTP } from './entities/otp.entity'
import { OtpController } from './otp.controller'
import { OtpService } from './otp.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([OTP]),
    ClientsModule.register([
      {
        name: 'OTP_SERVICE',
        transport: Transport.REDIS,
        options: {
          url: 'redis://localhost:55001',
          auth_pass: 'redispw',
          no_ready_check: true,
        },
      },
    ]),
  ],
  controllers: [OtpController],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
