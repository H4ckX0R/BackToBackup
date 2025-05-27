import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
// import { compareSync, hash } from 'bcrypt';
import { RefreshTokenPayload } from 'src/common-utils';
import { UserDto } from '../database/models/dto/user.dto';
import { UsersService } from '../database/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user?.password) return null;
    if (user && bcrypt.compareSync(password, user.password)) {
      return user.toResponseObject();
    }
    return null;
  }

  async createJWT(user: RefreshTokenPayload) {
    const email = await this.usersService.findUserEmail(user.id);
    if (!email) throw new UnauthorizedException('Usuario no encontrado');
    console.log('usuario si encontrado');
    const payload = { id: user.id, email: email };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '5m',
      }),
    };
  }

  createRefreshToken(user: UserDto) {
    const payload = {
      id: user.id,
    };
    return {
      refresh_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '30d',
      }),
    };
  }

  async registerUser(userDto: UserDto & { password: string }) {
    const hashedPassword = await bcrypt.hash(userDto.password, 12);
    userDto.password = hashedPassword;
    const user = await this.usersService.createOne(userDto);

    const token = await this.createJWT(user);
    const refreshToken = this.createRefreshToken(user);
    return { user: user, token, refreshToken };
  }

  async loginUser(userDto: UserDto) {
    const user = await this.usersService.findOne(userDto.id);
    if (!user) {
      throw new UnauthorizedException();
    }

    const token = await this.createJWT(user);
    const refreshToken = this.createRefreshToken(user);
    return { user: user, token, refreshToken };
  }
}
