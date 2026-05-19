import { Field, InputType, Int } from '@nestjs/graphql';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNumber, IsOptional, IsUUID, Max, Min } from 'class-validator';

@InputType()
export class AnalyzeCongestionDto {
  @Field()
  @ApiProperty({ example: 'd035f0c0-30df-4d3b-9d28-1d60a66a5348' })
  @IsUUID()
  zoneId: string;

  @Field(() => Int)
  @ApiProperty({ example: 110 })
  @IsInt()
  @Min(0)
  vehicleCount: number;

  @Field()
  @ApiProperty({ example: 28.5 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  averageSpeedKph: number;

  @Field(() => Int, { nullable: true })
  @ApiPropertyOptional({ example: 1, default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  incidentCount?: number;

  @Field({ nullable: true })
  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  isSimulated?: boolean;
}
