import { ApiProperty } from '@nestjs/swagger';
import { PageDto } from './page.dto';
import { UserDto } from './user.dto';

export class UserPageResponseDto extends PageDto<UserDto> {
  @ApiProperty({
    type: [UserDto],
  })
  data: UserDto[];
  constructor(data: UserDto[], pageNumber: number, pageSize: number, totalElements: number, totalPages: number) {
    super(data, pageNumber, pageSize, totalElements, totalPages);
    this.data = data;
  }
}
