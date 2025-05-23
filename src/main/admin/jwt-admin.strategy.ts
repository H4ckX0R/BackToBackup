import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JwtStrategy } from '../auth/jwt-auth.strategy';

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(JwtStrategy, 'jwt-admin') {

  async validate(payload: any) {
    const user = await this.usersService.findOne(payload.id);
    if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
    }
    return { id: payload.id, email: user.email, roles: user.roles };
  }
}
