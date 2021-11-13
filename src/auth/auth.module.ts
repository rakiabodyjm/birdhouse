import { forwardRef, Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UserModule } from 'src/user/user.module'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { LocalStrategy } from 'src/auth/strategies/local.strategy'
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy'
import { RolesGuard } from 'src/auth/guards/roles.guard'
@Module({
  imports: [
    forwardRef(() => UserModule),
    // PassportModule.register({
    //   defaultStrategy: 'jwt',
    //   property: 'user',
    // }),
    PassportModule,
    JwtModule.register({
      secret: process.env.SECRET_KEY || `Oasis2089$`,
      signOptions: {
        expiresIn: '5m',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    RolesGuard,
    // JwtAuthGuard,
  ],
})
export class AuthModule {}
