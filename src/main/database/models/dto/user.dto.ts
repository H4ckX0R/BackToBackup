import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude, plainToClass } from 'class-transformer';
import { IsEmail, IsUUID } from 'class-validator';
import { UserEntity } from '../entity/user.entity';
import { RoleDto } from './role.dto';

export class UserDto {
  @IsUUID()
  id: string;

  firstName: string;

  lastName: string;

  @IsEmail()
  email: string;

  @ApiHideProperty()
  @Exclude({ toPlainOnly: true })
  password?: string;

  roles: RoleDto[];

  static fromEntity(entity: UserEntity): UserDto {
    return plainToClass(UserDto, entity, { excludeExtraneousValues: false });
  }

  static toEntity(dto: UserDto): UserEntity {
    return plainToClass(UserEntity, dto, { excludeExtraneousValues: false });
  }

  constructor(partial?: Partial<UserDto>) {
    Object.assign(this, partial);
  }

  // Método auxiliar para crear una copia sin contraseña
  toResponseObject(): UserResponseDto {
    const { password, ...userResponse } = this;
    return userResponse as UserResponseDto;
  }
}

// Interfaz para los datos de usuario sin contraseña
export interface UserResponseDto extends Omit<UserDto, 'password'> {}
