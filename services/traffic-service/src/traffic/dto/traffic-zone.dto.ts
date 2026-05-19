import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CongestionLevel } from '../../common/types';

@ObjectType()
export class TrafficZoneDto {
  @Field()
  @ApiProperty({ example: 'd035f0c0-30df-4d3b-9d28-1d60a66a5348' })
  id: string;

  @Field()
  @ApiProperty({ example: 'Downtown Center' })
  name: string;

  @Field({ nullable: true })
  @ApiPropertyOptional({ example: 'Main business district' })
  description?: string | null;

  @Field(() => Float)
  @ApiProperty({ example: 36.8 })
  minLatitude: number;

  @Field(() => Float)
  @ApiProperty({ example: 36.85 })
  maxLatitude: number;

  @Field(() => Float)
  @ApiProperty({ example: 10.15 })
  minLongitude: number;

  @Field(() => Float)
  @ApiProperty({ example: 10.22 })
  maxLongitude: number;

  @Field(() => Int)
  @ApiProperty({ example: 60 })
  speedLimitKph: number;

  @Field(() => Int)
  @ApiProperty({ example: 150 })
  capacity: number;

  @Field(() => Float)
  @ApiProperty({ example: 68.33 })
  currentDensity: number;

  @Field(() => CongestionLevel)
  @ApiProperty({ enum: CongestionLevel })
  congestionLevel: CongestionLevel;

  @Field(() => Date)
  @ApiProperty({ example: '2026-05-18T18:30:00.000Z' })
  createdAt: Date;

  @Field(() => Date)
  @ApiProperty({ example: '2026-05-18T19:00:00.000Z' })
  updatedAt: Date;
}
