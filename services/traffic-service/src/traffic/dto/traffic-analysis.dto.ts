import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { CongestionLevel } from '../../common/types';

@ObjectType()
export class TrafficAnalysisDto {
  @Field()
  @ApiProperty({ example: '8f61be4a-c6ff-4184-96a5-9eec3f7f5674' })
  id: string;

  @Field()
  @ApiProperty({ example: 'd035f0c0-30df-4d3b-9d28-1d60a66a5348' })
  zoneId: string;

  @Field(() => Int)
  @ApiProperty({ example: 110 })
  vehicleCount: number;

  @Field(() => Float)
  @ApiProperty({ example: 28.5 })
  averageSpeedKph: number;

  @Field(() => Int)
  @ApiProperty({ example: 1 })
  incidentCount: number;

  @Field(() => Float)
  @ApiProperty({ example: 73.33 })
  densityPercent: number;

  @Field()
  @ApiProperty({ example: true })
  congestionDetected: boolean;

  @Field(() => CongestionLevel)
  @ApiProperty({ enum: CongestionLevel })
  classification: CongestionLevel;

  @Field()
  @ApiProperty({ example: false })
  isSimulated: boolean;

  @Field(() => Date)
  @ApiProperty({ example: '2026-05-18T19:00:00.000Z' })
  recordedAt: Date;
}
