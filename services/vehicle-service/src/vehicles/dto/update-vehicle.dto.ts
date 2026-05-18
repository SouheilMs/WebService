import { Field, InputType } from '@nestjs/graphql';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { VehicleStatus, VehicleType } from '../../common/types';

@InputType()
export class UpdateVehicleDto {
  @Field({ nullable: true })
  @ApiPropertyOptional({ example: '123TU4567' })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  licensePlate?: string;

  @Field({ nullable: true })
  @ApiPropertyOptional({ example: '1HGCM82633A004352' })
  @IsOptional()
  @IsString()
  @MinLength(11)
  @MaxLength(17)
  vin?: string;

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
  @ApiPropertyOptional({ example: 'Toyota' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  make?: string;

  @Field({ nullable: true })
  @ApiPropertyOptional({ example: 'Corolla' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  model?: string;

  @Field({ nullable: true })
  @ApiPropertyOptional({ example: 2025 })
  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  year?: number;

  @Field({ nullable: true })
  @ApiPropertyOptional({ example: 'Blue' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  color?: string;

  @Field({ nullable: true })
  @ApiPropertyOptional({ example: '4f6f5d12-49d1-47f9-a28b-3669f2d98e43', nullable: true })
  @IsOptional()
  @IsUUID()
  assignedOperatorId?: string;
}
