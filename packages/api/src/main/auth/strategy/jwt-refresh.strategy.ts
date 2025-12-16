import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { UserDto } from '../../database/models/dto/user.dto';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(configService: ConfigService) {
    const jwtSecret = configService.get<string>('JWT_REFRESH_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_REFRESH_SECRET no está definido en el archivo .env');
    }
    super({
      jwtFromRequest: (req: { cookies: { refresh_token: string } }) => req.cookies.refresh_token,
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  validate(payload: UserDto): UserDto {
    return payload;
  }
}
