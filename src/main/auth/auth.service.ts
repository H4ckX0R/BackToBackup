import { Injectable } from '@nestjs/common';
import { UsersService } from '../database/users/users.service';
import { UserDto } from '../database/models/dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (user && bcrypt.compareSync(password, user.password)) {
      return user;
    }
    return null;
  }

  async createJWT(user: UserDto) {
    const payload = {
      id: user.id,
      email: user.email,
    };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '1h',
      }),
    };
  }

  async createRefreshToken(user: UserDto) {
    const payload = {
      id: user.id,
    };
    return {
      refresh_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '24h',
      }),
    };
  }

  async registerUser(userDto: UserDto) {
    const hashedPassword = await bcrypt.hash(userDto.password, 12);
    userDto.password = hashedPassword;
    const user = await this.usersService.createOne(userDto);
    const token = await this.createJWT(user);
    const refreshToken = await this.createRefreshToken(user);
    return { user, token, refreshToken };
  }
}
