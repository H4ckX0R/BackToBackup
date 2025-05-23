import { IsUUID } from "class-validator";
import { plainToClass } from "class-transformer";
import { RoleEntity, PermissionLevel } from "../entity/role.entity";

export class RoleDto {
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
