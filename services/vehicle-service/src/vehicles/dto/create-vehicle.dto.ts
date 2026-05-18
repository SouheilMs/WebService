import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { VehicleStatus, VehicleType } from '../../common/types';

@InputType('InitialGpsPositionInput')
export class InitialGpsPositionInput {
  @Field()
  @ApiProperty({ example: 36.8065 })
  @IsNumber({ maxDecimalPlaces: 6 })
  @Min(-90)
  @Max(90)
  latitude: number;

  @Field()
  @ApiProperty({ example: 10.1815 })
  @IsNumber({ maxDecimalPlaces: 6 })
  @Min(-180)
  @Max(180)
  longitude: number;

  @Field({ nullable: true })
  @ApiPropertyOptional({ example: 12.4 })
  @IsOptional()
  @IsNumber()
  altitude?: number;

  @Field({ nullable: true })
  @ApiPropertyOptional({ example: 4.5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  accuracy?: number;

  @Field({ nullable: true })
  @ApiPropertyOptional({ example: 52.2 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(260)
  speed?: number;

  @Field({ nullable: true })
  @ApiPropertyOptional({ example: 180 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(360)
  heading?: number;

  @Field(() => Date, { nullable: true })
  @ApiPropertyOptional({ example: '2026-05-17T15:00:00.000Z' })
  @IsOptional()
  recordedAt?: Date;
}

@InputType()
export class CreateVehicleDto {
  @Field()
  @ApiProperty({ example: '123TU4567', description: 'Unique vehicle plate number' })
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  licensePlate: string;

  @Field({ nullable: true })
  @ApiPropertyOptional({ example: '1HGCM82633A004352' })
  @IsOptional()
  @IsString()
  @MinLength(11)
  @MaxLength(17)
  vin?: string;

  @Field(() => VehicleType)
  @ApiProperty({ enum: VehicleType })
  @IsEnum(VehicleType)
  type: VehicleType;

  @Field(() => VehicleStatus, { nullable: true })
  @ApiPropertyOptional({ enum: VehicleStatus, default: VehicleStatus.ACTIVE })
  @IsOptional()
  @IsEnum(VehicleStatus)
  status?: VehicleStatus;

  @Field()
  @ApiProperty({ example: 'Toyota' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  make: string;

  @Field()
  @ApiProperty({ example: 'Corolla' })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  model: string;

  @Field()
  @ApiProperty({ example: 2024 })
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  year: number;

  @Field({ nullable: true })
  @ApiPropertyOptional({ example: 'White' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  color?: string;

  @Field({ nullable: true })
  @ApiPropertyOptional({ example: '4f6f5d12-49d1-47f9-a28b-3669f2d98e43' })
  @IsOptional()
  @IsUUID()
  assignedOperatorId?: string;

  @Field(() => InitialGpsPositionInput, { nullable: true })
  @ApiPropertyOptional({ type: () => InitialGpsPositionInput })
  @IsOptional()
  @ValidateNested()
  @Type(() => InitialGpsPositionInput)
  initialPosition?: InitialGpsPositionInput;
}
