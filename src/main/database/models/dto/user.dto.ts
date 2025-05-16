import { ApiHideProperty } from "@nestjs/swagger";
import { IsEmail, IsUUID } from "class-validator";
import { plainToClass } from "class-transformer";
import { UserEntity } from "../entity/user.entity";

export class UserDto {
    @IsUUID()
    id: string;

    firstName: string;

    lastName: string;

    @IsEmail()
    email: string;

    @ApiHideProperty()
    password: string;

    static fromEntity(entity: UserEntity): UserDto {
        return plainToClass(UserDto, entity);
    }

    static toEntity(dto: UserDto): UserEntity {
        return plainToClass(UserEntity, dto);
    }

}
