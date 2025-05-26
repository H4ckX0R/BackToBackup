import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  InternalServerErrorException,
  Post,
  Request,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { LoggedInRequestWithUser, LoginRequestWithUser, RefreshRequestWithUser, ValidationError } from 'src/common-utils';
import { UserDto } from '../../database/models/dto/user.dto';
import { UsersService } from '../../database/users/users.service';
import { AuthService } from '../auth.service';
import { JwtRefreshAuthGuard } from '../guards/jwt-auth-refresh.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { LocalAuthGuard } from '../guards/local-auth.guard';

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
  async login(@Request() req: LoginRequestWithUser, @Res() res: Response) {
    const { user, token, refreshToken } = await this.authService.loginUser(req.user);
    res.cookie('token', token.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 40 * 24 * 60 * 60 * 1000, // 40 días
    });

    res.cookie('refresh_token', refreshToken.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 40 * 24 * 60 * 60 * 1000, // 40 días
    });

    res.send(user.toResponseObject());
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
  async register(@Request() req: any, @Res() res: Response) {
    // FIXME: Add dto for this request body and validate it with class-validator
    if (!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.password) {
      throw new BadRequestException('Faltan datos');
    }

    const newUser: UserDto = new UserDto();
    newUser.firstName = req.body.firstName;
    newUser.lastName = req.body.lastName;
    newUser.email = req.body.email;
    newUser.password = req.body.password;

    try {
      const { user, token, refreshToken } = await this.authService.registerUser(newUser as UserDto & { password: string });
      console.log('welldone');
      res.cookie('token', token.access_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 40 * 24 * 60 * 60 * 1000, // 40 días
      });

      res.cookie('refresh_token', refreshToken.refresh_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 40 * 24 * 60 * 60 * 1000, // 40 días
      });

      res.send(user.toResponseObject());
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new BadRequestException(error.message);
      } else {
        console.error('Error al registrar el usuario:', error);
        throw new InternalServerErrorException('Error al registrar el usuario');
      }
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
  async refreshToken(@Request() req: RefreshRequestWithUser, @Res() res: Response) {
    const token = await this.authService.createJWT(req.user);
    res.cookie('token', token.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 40 * 24 * 60 * 60 * 1000, // 40 días
    });
    res.send();
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
  logout(@Request() req: any, @Res() res: Response) {
    res.clearCookie('token');
    res.clearCookie('refresh_token');
    res.send();
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
  async getMe(@Request() req: LoggedInRequestWithUser) {
    const user = await this.usersService.findOne(req.user.id);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user.toResponseObject();
  }
}
