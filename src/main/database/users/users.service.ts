import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ValidationError } from 'src/common-utils';
import { DeleteResult, Repository } from 'typeorm';
import { PageDto } from '../models/dto/page.dto';
import { ORDER_OPTIONS, PageOptionsDto } from '../models/dto/pageOptions.dto';
import { RoleDto } from '../models/dto/role.dto';
import { UserDto, UserResponseDto } from '../models/dto/user.dto';
import { PermissionLevel } from '../models/entity/role.entity';
import { UserEntity } from '../models/entity/user.entity';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly rolesService: RolesService,
  ) {}

  async findOneByEmail(email: string): Promise<UserDto | null> {
    const user = await this.userRepository.findOne({ where: { email }, cache: true });
    if (!user) {
      return null;
    }
    return UserDto.fromEntity(user);
  }

  async findUserEmail(id: string): Promise<string | null> {
    const user = await this.userRepository.findOne({ where: { id }, cache: true, select: ['email'] });
    if (!user) {
      return null;
    }
    return user.email;
  }

  async findOne(id: string): Promise<UserDto | null> {
    const user = await this.userRepository.findOne({ where: { id }, relations: { roles: true }, cache: true });
    if (!user) {
      return null;
    }
    return UserDto.fromEntity(user);
  }

  async createOne(userDto: UserDto): Promise<UserDto> {
    if (!userDto.email) {
      throw new ValidationError('El email es obligatorio');
    }
    const userExists = await this.findOneByEmail(userDto.email);
    if (userExists) {
      throw new ValidationError('El usuario ya existe');
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
      throw new ValidationError('El usuario no existe');
    }
    const deletedUser = await this.userRepository.delete(id);
    return deletedUser;
  }

  async updateOne(id: string, userDto: UserDto): Promise<UserDto> {
    const user = await this.findOne(id);
    if (!user) {
      throw new ValidationError('El usuario no existe');
    }
    userDto.password = undefined;
    Object.assign(user, userDto);

    const userSaved = await this.userRepository.save(user);
    return UserDto.fromEntity(userSaved);
  }

  async getUsers(pageOptionsDto: PageOptionsDto): Promise<PageDto<UserResponseDto>> {
    const { pageNumber = 1, pageSize = 10, order = ORDER_OPTIONS.ASC } = pageOptionsDto;
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    queryBuilder.take(pageSize);
    queryBuilder.skip((pageNumber - 1) * pageSize);
    queryBuilder.orderBy('user.firstName', order);
    queryBuilder.leftJoinAndSelect('user.roles', 'roles');

    const [users, count] = await queryBuilder.getManyAndCount();

    // Convertir a DTO y eliminar contraseñas usando desestructuración
    const userDtos = users.map((user) => {
      const userDto = UserDto.fromEntity(user);
      return userDto.toResponseObject();
    });

    const page = new PageDto(userDtos, pageNumber, pageSize, count, Math.ceil(count / pageSize));
    return page;
  }
}
