import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AuthGuard } from '@nestjs/passport'
import { ApiTags } from '@nestjs/swagger'
import { Request, Response } from 'express'
import { Public } from 'src/auth/decorators/public.decorator'

import { Role } from 'src/auth/decorators/roles.decorator'
import { LoginUserDto } from 'src/auth/dto/login.dto'
import { RolesGuard } from 'src/auth/guards/roles.guard'
import { Roles } from 'src/types/Roles'
import { User } from 'src/user/entities/user.entity'
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

  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(
    @Req()
    req: Request & {
      user: User
    },
    @Body() loginBody: LoginUserDto,
    @Res({
      passthrough: true,
    })
    res: Response,
  ) {
    const { email, remember_me } = loginBody
    const user = req.user
    try {
      const userRole = await this.userService.getRole(user.id)

      const jwtTokenObject = userRole.reduce(
        (acc, ea) => ({
          ...acc,
          [`${ea}_id`]: user[ea].id,
        }),
        {
          user_id: user.id,
          email: email,
          first_name: user.first_name,
          last_name: user.last_name,
          roles: userRole,
        },
      )

      const access_token = this.jwtService.sign(jwtTokenObject, {
        // expiresIn: remember_me ? '1d' : '1h',
        expiresIn:
          process.env.NODE_ENV === 'development'
            ? remember_me
              ? '4h'
              : '1h'
            : remember_me
            ? '1w'
            : '1d',
      })
      /**
       *
       * number in hours
       * @param param
       * @returns
       */
      const getExpiry = (param: number) => {
        return new Date(Date.now() + 1000 * 60 * (param * 60))
      }
      const cookieExpiry =
        process.env.NODE_ENV === 'development'
          ? remember_me
            ? getExpiry(1)
            : getExpiry(0.5)
          : remember_me
          ? getExpiry(24)
          : getExpiry(4)

      res.cookie('ra', access_token, {
        httpOnly: true,
        expires: cookieExpiry,
        sameSite: 'none',
        signed: true,
        ...(process.env.NODE_ENV === 'production' && {
          // domain: req.headers.host,
          secure: true,
        }),
      })

      return {
        message: 'Access Granted',
        access_token,
        access_token_contents: this.jwtService.decode(access_token),
      }
    } catch (err) {
      throw new HttpException(err.message, 401)
    }
  }

  // @UseGuards(AuthGuard('jwt'))
  @Post('protect')
  async jwtRoute() {
    return 'hello world'
  }

  @Get('user')
  // @UseGuards(AuthGuard('jwt'))
  async getUser(@Req() req: Request, @Param('id') id: string) {
    return {
      ...req.user,
    }
  }

  @Get('role')
  @Role(Roles.ADMIN)
  @UseGuards(RolesGuard)
  getOnlyAsAdmin() {
    return 'hello admin'
  }

  @Post('/logout')
  logout(
    @Req() req: Request,
    @Res({
      passthrough: true,
    })
    res: Response,
  ) {
    res.cookie('ra', req.signedCookies.ra, {
      httpOnly: true,
      expires: new Date(Date.now()),
      sameSite: 'none',
      signed: true,
      ...(process.env.NODE_ENV === 'production' && {
        domain: req.headers.host,
        secure: true,
      }),
    })

    return {
      message: `Succesfully logged out`,
    }
  }

  // @Public()
  // @UseGuards(SiteAccessGuard)
  @Get('/is-cookie')
  cookie(@Req() req: Request) {
    return 'hi'
  }
}
