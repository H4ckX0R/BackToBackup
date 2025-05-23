import { Controller, Get, UseGuards, Query, UnauthorizedException, ForbiddenException, HttpCode, Delete, Param, Post, Body, Put } from '@nestjs/common';
import { JwtAdminGuard } from '../jwt-admin.guard';
import { UsersService } from '../../database/users/users.service';
import { PageOptionsDto } from '../../database/models/dto/pageOptions.dto';
import { ApiOkResponse, ApiForbiddenResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { UserPageResponseDto } from 'src/main/database/models/dto/userPageResponse.dto';
import { PageDto } from 'src/main/database/models/dto/page.dto';
import { UserDto, UserResponseDto } from 'src/main/database/models/dto/user.dto';
import { Request } from '@nestjs/common';
import { PermissionLevel } from 'src/main/database/models/entity/role.entity';
import { RolesService } from 'src/main/database/roles/roles.service';
import { RoleDto } from 'src/main/database/models/dto/role.dto';
import { DeleteResult, UpdateResult } from 'typeorm';

@Controller('admin')
export class AdminController {

    constructor(
        private readonly usersService: UsersService,
        private readonly rolesService: RolesService
    ) {}

    /**
     * Obtiene todos los usuarios
     */
    @ApiOkResponse({
        type: UserPageResponseDto,
    })
    @ApiForbiddenResponse({
        description: 'No tienes permiso para ver los usuarios'
    })
    @UseGuards(JwtAdminGuard)
    @Get("users")
    async getAllUsers(@Query() query: PageOptionsDto, @Request() req: any) {
        if (!req.user.roles.some(role => role.adminUsers.includes(PermissionLevel.READ))) {
            throw new ForbiddenException('No tienes permiso para ver los usuarios');
        }
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
        description: 'No tienes permiso para eliminar un usuario'
    })
    @UseGuards(JwtAdminGuard)
    @Delete("users/:id")
    async deleteUser(@Param('id') id: string, @Request() req: any) {
        if (!req.user.roles.some(role => role.adminUsers.includes(PermissionLevel.DELETE))) {
            throw new ForbiddenException('No tienes permiso para eliminar un usuario');
        }
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
        description: 'No tienes permiso para crear un usuario'
    })
    @UseGuards(JwtAdminGuard)
    @Post("users")
    @HttpCode(201)
    async createUser(@Body() userDto: UserDto, @Request() req: any) {
        if (!req.user.roles.some(role => role.adminUsers.includes(PermissionLevel.WRITE))) {
            throw new ForbiddenException('No tienes permiso para crear un usuario');
        }
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
        description: 'No tienes permiso para modificar un usuario'
    })
    @UseGuards(JwtAdminGuard)
    @Put("users/:id")
    async updateUser(@Param('id') id: string, @Body() userDto: UserDto, @Request() req: any) {
        if (!req.user.roles.some(role => role.adminUsers.includes(PermissionLevel.WRITE))) {
            throw new ForbiddenException('No tienes permiso para modificar un usuario');
        }
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
        description: 'No tienes permiso para ver los roles'
    })
    @UseGuards(JwtAdminGuard)
    @Get("roles")
    async getAllRoles(@Request() req: any) {
        if (!req.user.roles.some(role => role.adminRoles.includes(PermissionLevel.READ))) {
            throw new ForbiddenException('No tienes permiso para ver los roles');
        }
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
        description: 'No tienes permiso para crear un rol'
    })
    @UseGuards(JwtAdminGuard)
    @Post("roles")
    @HttpCode(201)
    async createRole(@Body() roleDto: RoleDto, @Request() req: any) {
        if (!req.user.roles.some(role => role.adminRoles.includes(PermissionLevel.WRITE))) {
            throw new ForbiddenException('No tienes permiso para crear un rol');
        }
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
        description: 'No tienes permiso para modificar un rol'
    })
    @UseGuards(JwtAdminGuard)
    @Put("roles/:id")
    async updateRole(@Param('id') id: string, @Body() roleDto: RoleDto, @Request() req: any) {
        if (!req.user.roles.some(role => role.adminRoles.includes(PermissionLevel.WRITE))) {
            throw new ForbiddenException('No tienes permiso para modificar un rol');
        }
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
        description: 'No tienes permiso para eliminar un rol'
    })
    @UseGuards(JwtAdminGuard)
    @Delete("roles/:id")
    async deleteRole(@Param('id') id: string, @Request() req: any) {
        if (!req.user.roles.some(role => role.adminRoles.includes(PermissionLevel.DELETE))) {
            throw new ForbiddenException('No tienes permiso para eliminar un rol');
        }
        const deleteResponse: DeleteResult = await this.rolesService.delete(id);
        return deleteResponse.affected === 1;
    }
}
