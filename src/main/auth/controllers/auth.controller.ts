import { BadRequestException, ConflictException, Controller, UnauthorizedException } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiBody,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiCreatedResponse,
  ApiConflictResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { HttpCode, UseGuards } from '@nestjs/common';
import { Post, Get } from '@nestjs/common';
import { Request } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { LocalAuthGuard } from '../local-auth.guard';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { UsersService } from '../../database/users/users.service';
import { JwtRefreshAuthGuard } from '../jwt-auth-refresh.guard';
import { UserDto } from '../../database/models/dto/user.dto';

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
        password: { type: 'string', example: 'password' },
      },
    },
  })
  @ApiOkResponse({
    description: 'Datos del usuario y una cookie con el token JWT',
    type: UserDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Inicio de sesión incorrecto',
  })
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('login')
  async login(@Request() req: any) {
    const { user, token, refreshToken } = await this.authService.loginUser(req.user);
    req.res.cookie('token', token.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 40 * 24 * 60 * 60 * 1000, // 40 días
    });

    req.res.cookie('refresh_token', refreshToken.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 40 * 24 * 60 * 60 * 1000, // 40 días
    });
    
    return user.toResponseObject();
  }

  /**
   * Endpoint de registro
   */
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        firstName: { type: 'string', example: 'John' },
        lastName: { type: 'string', example: 'Doe' },
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'password' },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'El usuario se ha creado',
    type: UserDto,
  })
  @ApiConflictResponse({
    description: 'El usuario ya existe',
  })
  @ApiBadRequestResponse({
    description: 'Faltan datos',
  })
  @HttpCode(201)
  @Post('register')
  async register(@Request() req: any) {

    if (!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.password) {
      throw new BadRequestException('Faltan datos');
    }

    const newUser = new UserDto();
    newUser.firstName = req.body.firstName;
    newUser.lastName = req.body.lastName;
    newUser.email = req.body.email;
    newUser.password = req.body.password;

    try {
      const { user, token, refreshToken } =
        await this.authService.registerUser(newUser);
      req.res.cookie('token', token.access_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 40 * 24 * 60 * 60 * 1000, // 40 días
      });

      req.res.cookie('refresh_token', refreshToken.refresh_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 40 * 24 * 60 * 60 * 1000, // 40 días
      });
    
      
      return user.toResponseObject();
    } catch (error) {
      throw new ConflictException(error.message);
    }
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
      maxAge: 40 * 24 * 60 * 60 * 1000, // 40 días
    });
    return;
  }

  /**
   * Endpoint de cierre de sesión
   */
  @ApiCookieAuth('token')
  @ApiCookieAuth('refresh_token')
  @ApiOkResponse({
    description: 'Se han eliminado las cookies',
  })
  @HttpCode(200)
  @Post('logout')
  async logout(@Request() req: any) {
    req.res.clearCookie('token');
    req.res.clearCookie('refresh_token');
    return;
  }

  /**
   * Endpoint de obtención de datos del usuario autenticado
   */
  @ApiCookieAuth('token')
  @ApiOkResponse({
    description: 'Datos del usuario autenticado',
    type: UserDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Token inválido',
  })
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Get('me')
  async getMe(@Request() req: any) {
    const user = await this.usersService.findOne(req.user.id);
    if (!user) {
      throw new UnauthorizedException();
    }
    
    return user.toResponseObject();
  }
}