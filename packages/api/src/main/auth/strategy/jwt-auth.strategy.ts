import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { UserDto } from '../../database/models/dto/user.dto';
import { UsersService } from '../../database/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    readonly usersService: UsersService,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET no está definido en el archivo .env');
    }
    super({
      jwtFromRequest: (req: { cookies: { token: string } }): string => req.cookies.token,
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  validate(payload: UserDto) {
    return payload;
  }
}
