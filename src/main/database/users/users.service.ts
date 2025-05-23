import { Injectable } from '@nestjs/common';
import { UserEntity } from '../models/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { UserDto, UserResponseDto } from '../models/dto/user.dto';
import { RoleDto } from '../models/dto/role.dto';
import { PermissionLevel } from '../models/entity/role.entity';
import { RolesService } from '../roles/roles.service';
import { PageDto } from '../models/dto/page.dto';
import { PageOptionsDto } from '../models/dto/pageOptions.dto';
import { ORDER_OPTIONS } from '../models/dto/pageOptions.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) {}

    async findOneByEmail(email: string): Promise<UserDto | null> {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            return null;
        }
        return UserDto.fromEntity(user);
    }

    async createOne(userDto: UserDto): Promise<UserDto> {
        //TODO: Si no existe ningún usuario en la base de datos, crear rol de admin y asignarlo a este usuario
        const userExists = await this.findOneByEmail(userDto.email);
        if (userExists) {
            throw new Error('El usuario ya existe');
        }
        
        const userCount = await this.userRepository.count();
        if (userCount === 0) {
            const role = new RoleDto();
            role.name = 'Administrador';
            role.adminUsers = [PermissionLevel.READ, PermissionLevel.WRITE, PermissionLevel.DELETE];
            role.adminSystem = [PermissionLevel.READ, PermissionLevel.WRITE, PermissionLevel.DELETE];
            role.adminRoles = [PermissionLevel.READ, PermissionLevel.WRITE, PermissionLevel.DELETE];
            const roleSaved = await this.rolesService.create(role);
            userDto.roles = [roleSaved];
        }
        

        const { id, ...userDtoSinId } = userDto;
        const userSaved = await this.userRepository.save(userDtoSinId);
        return UserDto.fromEntity(userSaved);
    }

    async deleteOne(id: string): Promise<DeleteResult> {
        const user = await this.findOne(id);
        if (!user) {
            throw new Error('El usuario no existe');
        }
        const deletedUser = await this.userRepository.delete(id);
        return deletedUser;
    }

    async updateOne(id: string, userDto: UserDto): Promise<UserDto> {
        const user = await this.findOne(id);
        if (!user) {
            throw new Error('El usuario no existe');
        }
        userDto.password = undefined;
        Object.assign(user, userDto);

        const userSaved = await this.userRepository.save(user);
        return UserDto.fromEntity(userSaved);
    }
}
