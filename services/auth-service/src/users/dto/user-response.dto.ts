import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../common/types';

export class UserResponseDto {
  @ApiProperty({ example: 'uuid-v4-string' })
  id: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @ApiProperty({ example: 'johndoe' })
  username: string;

  @ApiProperty({ enum: Role, example: Role.OPERATOR })
  role: Role;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2024-01-15T08:30:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-15T08:30:00.000Z' })
  updatedAt: Date;
}
