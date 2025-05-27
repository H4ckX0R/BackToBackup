import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiForbiddenResponse, ApiOkResponse } from '@nestjs/swagger';
import { PageDto } from 'src/main/database/models/dto/page.dto';
import { RoleDto } from 'src/main/database/models/dto/role.dto';
import { UserDto, UserResponseDto } from 'src/main/database/models/dto/user.dto';
import { UserPageResponseDto } from 'src/main/database/models/dto/userPageResponse.dto';
import { PermissionLevel } from 'src/main/database/models/entity/role.entity';
import { RolesService } from 'src/main/database/roles/roles.service';
import { DeleteResult, UpdateResult } from 'typeorm';
import { PageOptionsDto } from '../../database/models/dto/pageOptions.dto';
import { UsersService } from '../../database/users/users.service';
import { CheckRolePermission, RolesAdminGuard } from '../jwt-admin.guard';

@Controller('admin')
// @UseGuards(JwtAdminGuard)
export class AdminController {
  constructor(
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
  ) {}

  /**
   * Obtiene todos los usuarios
   */
  @ApiOkResponse({
    type: UserPageResponseDto,
  })
  @ApiForbiddenResponse({
    description: 'No tienes permiso para ver los usuarios',
  })
  @Get('users')
  @UseGuards(RolesAdminGuard)
  @CheckRolePermission('adminUsers', PermissionLevel.READ, 'No tienes permiso para ver los usuarios')
  async getAllUsers(@Query() query: PageOptionsDto) {
    const users: PageDto<UserResponseDto> = await this.usersService.getUsers(query);
    return users;
  }

  /**
   * Elimina un usuario
   */
  @ApiOkResponse({
    description: 'Usuario eliminado',
    type: Boolean,
  })
  @ApiForbiddenResponse({
    description: 'No tienes permiso para eliminar un usuario',
  })
  @Delete('users/:id')
  @UseGuards(RolesAdminGuard)
  @CheckRolePermission('adminUsers', PermissionLevel.DELETE, 'No tienes permiso para eliminar un usuario')
  async deleteUser(@Param('id') id: string) {
    const deleteResponse = await this.usersService.deleteOne(id);
    return deleteResponse.affected === 1;
  }

  /**
   * Crea un usuario
   */
  @ApiCreatedResponse({
    description: 'Usuario creado',
    type: UserDto,
  })
  @ApiForbiddenResponse({
    description: 'No tienes permiso para crear un usuario',
  })
  @Post('users')
  @HttpCode(201)
  @UseGuards(RolesAdminGuard)
  @CheckRolePermission('adminUsers', PermissionLevel.WRITE, 'No tienes permiso para crear un usuario')
  async createUser(@Body() userDto: UserDto) {
    const user: UserDto = await this.usersService.createOne(userDto);
    return user;
  }

  /**
   * Modifica un usuario
   */
  @ApiOkResponse({
    description: 'Usuario modificado',
    type: UserDto,
  })
  @ApiForbiddenResponse({
    description: 'No tienes permiso para modificar un usuario',
  })
  @Put('users/:id')
  @UseGuards(RolesAdminGuard)
  @CheckRolePermission('adminUsers', PermissionLevel.WRITE, 'No tienes permiso para modificar un usuario')
  async updateUser(@Param('id') id: string, @Body() userDto: UserDto) {
    const user: UserDto = await this.usersService.updateOne(id, userDto);
    return user;
  }

  /**
   * Obtiene todos los roles
   */
  @ApiOkResponse({
    type: RoleDto,
    isArray: true,
  })
  @ApiForbiddenResponse({
    description: 'No tienes permiso para ver los roles',
  })
  @Get('roles')
  @UseGuards(RolesAdminGuard)
  @CheckRolePermission('adminRoles', PermissionLevel.READ, 'No tienes permiso para ver los roles')
  async getAllRoles() {
    const roles: RoleDto[] = await this.rolesService.getAllRoles();
    return roles;
  }

  /**
   * Crea un rol
   */
  @ApiCreatedResponse({
    description: 'Rol creado',
    type: RoleDto,
  })
  @ApiForbiddenResponse({
    description: 'No tienes permiso para crear un rol',
  })
  @Post('roles')
  @HttpCode(201)
  @UseGuards(RolesAdminGuard)
  @CheckRolePermission('adminRoles', PermissionLevel.WRITE, 'No tienes permiso para crear un rol')
  async createRole(@Body() roleDto: RoleDto) {
    const role: RoleDto = await this.rolesService.create(roleDto);
    return role;
  }

  /**
   * Modifica un rol
   */
  @ApiOkResponse({
    description: 'Rol modificado',
    type: Boolean,
  })
  @ApiForbiddenResponse({
    description: 'No tienes permiso para modificar un rol',
  })
  @Put('roles/:id')
  @UseGuards(RolesAdminGuard)
  @CheckRolePermission('adminRoles', PermissionLevel.WRITE, 'No tienes permiso para modificar un rol')
  async updateRole(@Param('id') id: string, @Body() roleDto: RoleDto) {
    const updateResponse: UpdateResult = await this.rolesService.update(id, roleDto);
    return updateResponse.affected === 1;
  }

  /**
   * Elimina un rol
   */
  @ApiOkResponse({
    description: 'Rol eliminado',
    type: Boolean,
  })
  @ApiForbiddenResponse({
    description: 'No tienes permiso para eliminar un rol',
  })
  @Delete('roles/:id')
  @UseGuards(RolesAdminGuard)
  @CheckRolePermission('adminRoles', PermissionLevel.DELETE, 'No tienes permiso para eliminar un rol')
  async deleteRole(@Param('id') id: string) {
    const deleteResponse: DeleteResult = await this.rolesService.delete(id);
    return deleteResponse.affected === 1;
  }
}
