import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@ObjectType()
export class TrafficClassificationSummaryDto {
  @Field(() => Int)
  @ApiProperty({ example: 4 })
  low: number;

  @Field(() => Int)
  @ApiProperty({ example: 7 })
  medium: number;

  @Field(() => Int)
  @ApiProperty({ example: 3 })
  high: number;

  @Field(() => Int)
  @ApiProperty({ example: 14 })
  total: number;
}
