import { forwardRef, Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'src/user/entities/user.entity'
import { SubdistributorModule } from 'src/subdistributor/subdistributor.module'
import { RetailersModule } from 'src/retailers/retailers.module'
import { DspModule } from 'src/dsp/dsp.module'
import { AdminModule } from 'src/admin/admin.module'
import { JwtModule } from '@nestjs/jwt'

export const accountModules = [
  RetailersModule,
  SubdistributorModule,
  DspModule,
  AdminModule,
]
@Module({
  imports: [
    // CacheModule.register(),
    TypeOrmModule.forFeature([User]),
    ...accountModules.map((module) => forwardRef(() => module)),
    JwtModule.register({
      secret: process.env.SECRET_KEY || `Demo_Secret_Key`,
      signOptions: {
        expiresIn: '5m',
      },
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
