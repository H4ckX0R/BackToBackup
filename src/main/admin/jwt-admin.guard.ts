import { CanActivate, ExecutionContext, ForbiddenException, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { LoggedInTokenPayload } from 'src/common-utils';
import { RoleDto } from '../database/models/dto/role.dto';
import { PermissionLevel, Permissions } from '../database/models/entity/role.entity';

export type ScopePermissionConfig = { scope: keyof Permissions; allowedRoles: PermissionLevel[]; customErrorMsg?: string };
export const CheckRolePermission = (scope: keyof Permissions, allowedRoles: PermissionLevel | PermissionLevel[], customErrorMsg?: string) =>
  SetMetadata('role-permission', { scope, allowedRoles: Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles], customErrorMsg } as ScopePermissionConfig);

// TODO CHECK: think if it is just better to use a generic AuthGuard for authentication and other guards like role checking for authorization.
// @Injectable()
// export class JwtAdminGuard extends AuthGuard('jwt-admin') {}
@Injectable()
export class RolesAdminGuard extends AuthGuard('jwt-admin') implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const jwtValid = await super.canActivate(context);
    if (!jwtValid) return false;

    const scopePermissions = this.reflector.getAllAndOverride<ScopePermissionConfig>('role-permission', [context.getHandler(), context.getClass()]);

    if (!scopePermissions) return true;

    const req: Request & { user: LoggedInTokenPayload & { roles: RoleDto[] } } = context.switchToHttp().getRequest();
    console.log('Request User Roles:', req.user, req.user?.roles);

    // console.log(context.switchToHttp().getRequest());

    // Verifies that the user has at least one role with the required permission level for the specified scope.
    // If none of the user's roles match the allowed permission levels defined in `scopePermissions.allowedRoles`
    // for the given scope (`scopePermissions.scope`), a ForbiddenException is thrown to deny access.
    if (!req.user.roles.some((role) => role[scopePermissions.scope].some((level) => scopePermissions.allowedRoles.includes(level)))) {
      throw new ForbiddenException(scopePermissions.customErrorMsg || `No tienes permiso para realizar esta acción en el ámbito ${scopePermissions.scope}`);
    }

    return true;
  }
}
