import { ApiProperty } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { IsEmail, IsString, IsUUID } from 'class-validator';
import { UserEntity } from '../entity/user.entity';
import { EffectivePermissions } from './role.dto';

export class UserDto {
  @IsUUID()
  id: string;

  @IsString()
  @ApiProperty({ type: 'string', description: 'Nombre del usuario', example: 'John' })
  firstName: string;

  @IsString()
  @ApiProperty({ type: 'string', description: 'Apellido del usuario', example: 'Doe' })
  lastName: string;

  @IsEmail()
  @ApiProperty({ type: 'string', description: 'Email del usuario', example: 'user@example.com' })
  email: string;

  @ApiProperty()
  effectivePermissions: EffectivePermissions;

  static fromEntity(entity: UserEntity, effectivePermissions: EffectivePermissions): UserDto {
    const userDto = plainToClass(UserDto, entity, { excludePrefixes: ['roles', 'devices', 'password'] });
    userDto.effectivePermissions = effectivePermissions;
    return userDto;
  }

  static toEntity(dto: UserDto): UserEntity {
    return plainToClass(UserEntity, dto, { excludePrefixes: ['roles', 'devices'] });
  }

  constructor(partial?: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}
