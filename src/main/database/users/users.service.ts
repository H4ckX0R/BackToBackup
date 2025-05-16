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
}
