import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { RoleEntity } from '../models/entity/role.entity';
import { RoleDto } from '../models/dto/role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  async getAllRoles(): Promise<RoleDto[]> {
    return (await this.roleRepository.find()).map((role) =>
      RoleDto.fromEntity(role),
    );
  }

  async findOne(id: string): Promise<RoleDto> {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new Error('El rol no existe');
    }
    return RoleDto.fromEntity(role);
  }

  async create(role: RoleDto): Promise<RoleDto> {
    const roleEntity = RoleDto.toEntity(role);
    return RoleDto.fromEntity(await this.roleRepository.save(roleEntity));
  }

  async update(id: string, role: RoleDto): Promise<UpdateResult> {
    const roleEntity = RoleDto.toEntity(role);
    const updatedRole = await this.roleRepository.update(id, roleEntity);
    return updatedRole;
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.roleRepository.delete(id);
  }
}
