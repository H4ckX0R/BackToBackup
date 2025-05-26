import { plainToClass } from 'class-transformer';
import { IsUUID } from 'class-validator';
import { PermissionLevel, Permissions, RoleEntity } from '../entity/role.entity';

export class RoleDto implements Permissions {
  @IsUUID()
  id: string;

  name: string;

  adminUsers: PermissionLevel[];

  adminSystem: PermissionLevel[];

  adminRoles: PermissionLevel[];

  static fromEntity(entity: RoleEntity): RoleDto {
    return plainToClass(RoleDto, entity);
  }

  static toEntity(dto: RoleDto): RoleEntity {
    dto.adminUsers = dto.adminUsers || [];
    dto.adminSystem = dto.adminSystem || [];
    dto.adminRoles = dto.adminRoles || [];
    return plainToClass(RoleEntity, dto);
  }
}
