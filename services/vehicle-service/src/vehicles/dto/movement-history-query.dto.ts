import { ArgsType, Field, Int } from '@nestjs/graphql';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsInt, IsOptional, Max, Min } from 'class-validator';

@ArgsType()
export class MovementHistoryQueryDto {
  @Field(() => Int, { nullable: true, defaultValue: 1 })
  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @Field(() => Int, { nullable: true, defaultValue: 20 })
  @ApiPropertyOptional({ example: 20, default: 20 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @Field(() => Date, { nullable: true })
  @ApiPropertyOptional({ example: '2026-05-17T00:00:00.000Z' })
  @IsOptional()
  @IsDate()
  from?: Date;

  @Field(() => Date, { nullable: true })
  @ApiPropertyOptional({ example: '2026-05-18T00:00:00.000Z' })
  @IsOptional()
  @IsDate()
  to?: Date;
}
