import { Controller, UnauthorizedException } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiBody,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { HttpCode, UseGuards } from '@nestjs/common';
import { Post, Get } from '@nestjs/common';
import { Request } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { LocalAuthGuard } from '../local-auth.guard';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { UsersService } from '../../database/users/users.service';
import { JwtRefreshAuthGuard } from '../jwt-auth-refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}
  /**
   * Endpoint de inicio de sesión
   */
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'passwordHashed' },
      },
    },
  })
  @ApiOkResponse({
    description: 'Datos del usuario y una cookie con el token JWT',
    schema: {
      type: 'object',
      properties: {
        firstName: { type: 'string', example: 'John' },
        lastName: { type: 'string', example: 'Doe' },
        email: { type: 'string', example: 'user@example.com' },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Inicio de sesión incorrecto',
  })
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('login')
  async login(@Request() req: any) {
    const token = await this.authService.createJWT(req.user);
    req.res.cookie('token', token.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    const refreshToken = await this.authService.createRefreshToken(req.user);
    req.res.cookie('refresh_token', refreshToken.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    const { password, id, ...cleanUser } = req.user;
    return cleanUser;
  }

  /**
   * Endpoint para renovar el token JWT
   */
  @ApiCookieAuth('refresh_token')
  @ApiOkResponse({
    description: 'Cookie con el token JWT nuevo',
  })
  @ApiUnauthorizedResponse({
    description: 'Refresh token inválido',
  })
  @UseGuards(JwtRefreshAuthGuard)
  @HttpCode(200)
  @Post('refresh')
  async refreshToken(@Request() req: any) {
    const token = await this.authService.createJWT(req.user);
    req.res.cookie('token', token.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    return;
  }

  /**
   * Endpoint de obtención del perfil del usuario de prueba
   */
  @ApiCookieAuth('token')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Get('profile')
  async getProfile(@Request() req: any) {
    const user = await this.usersService.findOneByEmail(req.user.email);
    if (!user) {
      throw new UnauthorizedException();
    }
    const { password, id, ...cleanUser } = user;
    return cleanUser;
  }
}
