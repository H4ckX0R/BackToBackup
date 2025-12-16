import { Injectable } from '@angular/core';
import { AdminService } from '../../../api/services/admin.service';
import { AdminControllerGetAllUsers$Params } from '../../../api/fn/admin/admin-controller-get-all-users';
import { NewRoleDto, RoleDto, UserDto, CreateUserWithRolesDto } from '../../../api/models';

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService {

  constructor(private apiAdmin: AdminService) { }

  getAllUsers(options: AdminControllerGetAllUsers$Params) {
    return this.apiAdmin.adminControllerGetAllUsers(options);
  }

  getAllRoles() {
    return this.apiAdmin.adminControllerGetAllRoles();
  }

  deleteUser(id: string) {
    return this.apiAdmin.adminControllerDeleteUser({
      id: id
    });
  }

  createUser(user: CreateUserWithRolesDto) {
    return this.apiAdmin.adminControllerCreateUser({
      body: user
    });
  }

  updateUser(user: UserDto) {
    return this.apiAdmin.adminControllerUpdateUser({
      id: user.id,
      body: user
    });
  }


  createRole(role: NewRoleDto) {
    if (!role.adminUsers) {
      role.adminUsers = [];
    }
    if (!role.adminRoles) {
      role.adminRoles = [];
    }
    if (!role.adminSystem) {
      role.adminSystem = [];
    }
    return this.apiAdmin.adminControllerCreateRole({
      body: role
    });
  }

  updateRole(role: RoleDto) {
    return this.apiAdmin.adminControllerUpdateRole({
      id: role.id,
      body: role
    });
  }

  deleteRole(id: string) {
    return this.apiAdmin.adminControllerDeleteRole({
      id: id
    });
  }
}
