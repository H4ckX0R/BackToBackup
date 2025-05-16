import { Injectable } from '@nestjs/common';
import { UserEntity } from '../models/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from '../models/dto/user.dto';

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
        
        const user = this.userRepository.create(UserDto.toEntity(userDto));
        const userSaved = await this.userRepository.save(user);
        return UserDto.fromEntity(userSaved);
    }
}
