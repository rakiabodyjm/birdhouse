import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AuthGuard } from '@nestjs/passport'
import { Request } from 'express'
import { LoginUserDto } from 'src/auth/dto/login.dto'
import { UserService } from 'src/user/user.service'
import { AuthService } from './auth.service'
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Body() loginBody: LoginUserDto) {
    const { email, password, remember_me } = loginBody

    try {
      const user = await this.authService.validateUser(email, password)
      const userRole = await this.userService.getRole(user.id)
      return {
        success: 'Access Granted',
        access_token: this.jwtService.sign(
          {
            email: email,
            role: userRole,
          },
          {
            expiresIn: remember_me ? '1d' : '1h',
          },
        ),
      }
    } catch (err) {
      console.log(err)
      throw new HttpException(err.message, 401)
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('protected-route')
  async jwtRoute() {
    return 'hello world'
  }

  //   @UseGuards(AuthGuard('local'))
  //   @Post('login')
  //   async login(@Req() req: Request) {
  //     return {
  //       message: 'Authorized',
  //       // user: req.user,

  //     }
  //     // return req.user
  //   }
}
