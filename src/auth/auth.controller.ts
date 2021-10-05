import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AuthGuard } from '@nestjs/passport'
import { ApiTags } from '@nestjs/swagger'
import { Request } from 'express'
import { LoginUserDto } from 'src/auth/dto/login.dto'
import { UserService } from 'src/user/user.service'
import { AuthService } from './auth.service'
@ApiTags('Authentication Routes')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req, @Body() loginBody: LoginUserDto) {
    const { email, password, remember_me } = loginBody
    const user = req.user
    // console.log(req.user)
    try {
      // const user = await this.authService.validateUser(email, password)
      const userRole = await this.userService.getRole(user.id)
      const access_token = this.jwtService.sign(
        {
          user_id: user.id,
          email: email,
          first_name: user.first_name,
          last_name: user.last_name,
          roles: userRole,
        },
        {
          // expiresIn: remember_me ? '1d' : '1h',
          expiresIn:
            process.env.NODE_ENV === 'development'
              ? remember_me
                ? '15m'
                : '1m'
              : remember_me
              ? '1d'
              : '1h',
        },
      )
      return {
        message: 'Access Granted',
        access_token,
        access_token_contents: this.jwtService.decode(access_token),
      }
    } catch (err) {
      console.log(err)
      throw new HttpException(err.message, 401)
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('protect')
  async jwtRoute() {
    return 'hello world'
  }

  @Get('user')
  @UseGuards(AuthGuard('jwt'))
  async getUser(@Req() req: Request, @Param('id') id: string) {
    return {
      ...req.user,
    }
  }
}
