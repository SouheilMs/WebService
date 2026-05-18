import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PositionSource } from '../../common/types';

@ObjectType()
export class GPSPositionDto {
  @Field()
  @ApiProperty({ example: 'fc928048-d11f-4f18-a9e6-4ccfedfe9822' })
  id: string;

  @Field()
  @ApiProperty({ example: 'd035f0c0-30df-4d3b-9d28-1d60a66a5348' })
  vehicleId: string;

  @Field()
  @ApiProperty({ example: 36.8067 })
  latitude: number;

  @Field()
  @ApiProperty({ example: 10.1819 })
  longitude: number;

  @Field({ nullable: true })
  @ApiPropertyOptional({ example: 12.5 })
  altitude?: number | null;

  @Field({ nullable: true })
  @ApiPropertyOptional({ example: 4.1 })
  accuracy?: number | null;

  @Field({ nullable: true })
  @ApiPropertyOptional({ example: 54.2 })
  speed?: number | null;

  @Field({ nullable: true })
  @ApiPropertyOptional({ example: 130 })
  heading?: number | null;

  @Field(() => PositionSource)
  @ApiProperty({ enum: PositionSource })
  source: PositionSource;

  @Field(() => Date)
  @ApiProperty({ example: '2026-05-17T16:00:00.000Z' })
  recordedAt: Date;

  @Field(() => Date)
  @ApiProperty({ example: '2026-05-17T16:00:00.000Z' })
  createdAt: Date;
}
