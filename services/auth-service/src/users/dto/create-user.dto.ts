import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength, MaxLength } from 'class-validator';
import { Role } from '../../common/types';

export class CreateUserDto {
  @ApiProperty({ example: 'john.doe@example.com', description: 'Unique user email' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @ApiProperty({ example: 'johndoe', description: 'Unique username (3-30 chars)' })
  @IsString()
  @MinLength(3, { message: 'Username must be at least 3 characters' })
  @MaxLength(30, { message: 'Username must not exceed 30 characters' })
  username: string;

  @ApiProperty({ example: 'P@ssw0rd!', description: 'Password (min 8 chars)' })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password: string;

  @ApiPropertyOptional({ enum: Role, default: Role.OPERATOR })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
