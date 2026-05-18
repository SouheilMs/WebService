import { Field, InputType, Int } from '@nestjs/graphql';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, Max, Min } from 'class-validator';

@InputType()
export class SimulateTrackingDto {
  @Field(() => Int, { nullable: true })
  @ApiPropertyOptional({
    example: 5,
    default: 1,
    description: 'How many simulated points to generate',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  steps?: number;

  @Field(() => Int, { nullable: true })
  @ApiPropertyOptional({
    example: 60,
    default: 60,
    description: 'Seconds between generated points',
  })
  @IsOptional()
  @IsInt()
  @Min(5)
  @Max(3600)
  intervalSeconds?: number;

  @Field({ nullable: true })
  @ApiPropertyOptional({ example: 42 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(260)
  speedKph?: number;

  @Field({ nullable: true })
  @ApiPropertyOptional({ example: 90 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(360)
  heading?: number;

  @Field({ nullable: true })
  @ApiPropertyOptional({ example: 36.8065 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 6 })
  @Min(-90)
  @Max(90)
  startLatitude?: number;

  @Field({ nullable: true })
  @ApiPropertyOptional({ example: 10.1815 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 6 })
  @Min(-180)
  @Max(180)
  startLongitude?: number;

  @Field({ nullable: true })
  @ApiPropertyOptional({ example: 4.2 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  accuracy?: number;

  @Field({ nullable: true })
  @ApiPropertyOptional({ example: 15.1 })
  @IsOptional()
  @IsNumber()
  altitude?: number;
}
