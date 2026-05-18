import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VehicleStatus, VehicleType } from '../../common/types';
import { GPSPositionDto } from './gps-position.dto';

@ObjectType()
export class VehicleDto {
  @Field()
  @ApiProperty({ example: 'd035f0c0-30df-4d3b-9d28-1d60a66a5348' })
  id: string;

  @Field()
  @ApiProperty({ example: '123TU4567' })
  licensePlate: string;

  @Field({ nullable: true })
  @ApiPropertyOptional({ example: '1HGCM82633A004352' })
  vin?: string | null;

  @Field(() => VehicleType)
  @ApiProperty({ enum: VehicleType })
  type: VehicleType;

  @Field(() => VehicleStatus)
  @ApiProperty({ enum: VehicleStatus })
  status: VehicleStatus;

  @Field()
  @ApiProperty({ example: 'Toyota' })
  make: string;

  @Field()
  @ApiProperty({ example: 'Corolla' })
  model: string;

  @Field(() => Int)
  @ApiProperty({ example: 2024 })
  year: number;

  @Field({ nullable: true })
  @ApiPropertyOptional({ example: 'White' })
  color?: string | null;

  @Field({ nullable: true })
  @ApiPropertyOptional({ example: '4f6f5d12-49d1-47f9-a28b-3669f2d98e43' })
  assignedOperatorId?: string | null;

  @Field(() => Int)
  @ApiProperty({ example: 12 })
  positionCount: number;

  @Field(() => GPSPositionDto, { nullable: true })
  @ApiPropertyOptional({ type: () => GPSPositionDto })
  currentPosition?: GPSPositionDto | null;

  @Field(() => Date)
  @ApiProperty({ example: '2026-05-17T16:00:00.000Z' })
  createdAt: Date;

  @Field(() => Date)
  @ApiProperty({ example: '2026-05-17T16:00:00.000Z' })
  updatedAt: Date;

  @Field(() => Date, { nullable: true })
  @ApiPropertyOptional({ example: '2026-05-17T18:00:00.000Z' })
  deletedAt?: Date | null;
}
