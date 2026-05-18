import { ArgsType, Field, Int } from '@nestjs/graphql';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsIn, IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
import { VehicleStatus, VehicleType } from '../../common/types';

@ArgsType()
export class VehicleQueryDto {
  @Field(() => Int, { nullable: true, defaultValue: 1 })
  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @Field(() => Int, { nullable: true, defaultValue: 10 })
  @ApiPropertyOptional({ example: 10, default: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @Field(() => VehicleType, { nullable: true })
  @ApiPropertyOptional({ enum: VehicleType })
  @IsOptional()
  @IsEnum(VehicleType)
  type?: VehicleType;

  @Field(() => VehicleStatus, { nullable: true })
  @ApiPropertyOptional({ enum: VehicleStatus })
  @IsOptional()
  @IsEnum(VehicleStatus)
  status?: VehicleStatus;

  @Field({ nullable: true })
  @ApiPropertyOptional({ example: 'toyota' })
  @IsOptional()
  @IsString()
  search?: string;

  @Field({ nullable: true })
  @ApiPropertyOptional({ example: '4f6f5d12-49d1-47f9-a28b-3669f2d98e43' })
  @IsOptional()
  @IsUUID()
  assignedOperatorId?: string;

  @Field({ nullable: true, defaultValue: 'createdAt' })
  @ApiPropertyOptional({ example: 'createdAt', enum: ['createdAt', 'updatedAt', 'licensePlate'] })
  @IsOptional()
  @IsIn(['createdAt', 'updatedAt', 'licensePlate'])
  sortBy?: 'createdAt' | 'updatedAt' | 'licensePlate' = 'createdAt';

  @Field({ nullable: true, defaultValue: 'desc' })
  @ApiPropertyOptional({ example: 'desc', enum: ['asc', 'desc'] })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';
}
