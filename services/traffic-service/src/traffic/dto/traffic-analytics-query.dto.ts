import { ArgsType, Field, Int } from '@nestjs/graphql';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';

@ArgsType()
export class TrafficAnalyticsQueryDto {
  @Field(() => Int, { nullable: true, defaultValue: 10 })
  @ApiPropertyOptional({ example: 10, default: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @Field({ nullable: true })
  @ApiPropertyOptional({ example: 'd035f0c0-30df-4d3b-9d28-1d60a66a5348' })
  @IsOptional()
  @IsUUID()
  zoneId?: string;
}
