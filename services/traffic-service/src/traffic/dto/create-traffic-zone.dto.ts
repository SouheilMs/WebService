import { Field, InputType, Int } from '@nestjs/graphql';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, IsString, Max, Min, MinLength } from 'class-validator';

@InputType()
export class CreateTrafficZoneDto {
  @Field()
  @ApiProperty({ example: 'Downtown Center' })
  @IsString()
  @MinLength(2)
  name: string;

  @Field({ nullable: true })
  @ApiPropertyOptional({ example: 'Main business district' })
  @IsOptional()
  @IsString()
  description?: string;

  @Field()
  @ApiProperty({ example: 36.8 })
  @IsNumber({ maxDecimalPlaces: 6 })
  @Min(-90)
  @Max(90)
  minLatitude: number;

  @Field()
  @ApiProperty({ example: 36.85 })
  @IsNumber({ maxDecimalPlaces: 6 })
  @Min(-90)
  @Max(90)
  maxLatitude: number;

  @Field()
  @ApiProperty({ example: 10.15 })
  @IsNumber({ maxDecimalPlaces: 6 })
  @Min(-180)
  @Max(180)
  minLongitude: number;

  @Field()
  @ApiProperty({ example: 10.22 })
  @IsNumber({ maxDecimalPlaces: 6 })
  @Min(-180)
  @Max(180)
  maxLongitude: number;

  @Field(() => Int, { nullable: true })
  @ApiPropertyOptional({ example: 60, default: 50 })
  @IsOptional()
  @IsInt()
  @Min(10)
  @Max(150)
  speedLimitKph?: number;

  @Field(() => Int, { nullable: true })
  @ApiPropertyOptional({ example: 150, default: 100 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5000)
  capacity?: number;
}
