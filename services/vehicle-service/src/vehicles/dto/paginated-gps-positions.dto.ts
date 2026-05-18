import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { GPSPositionDto } from './gps-position.dto';

@ObjectType()
export class PaginatedGpsPositionsDto {
  @Field(() => [GPSPositionDto])
  @ApiProperty({ type: () => [GPSPositionDto] })
  items: GPSPositionDto[];

  @Field(() => Int)
  @ApiProperty({ example: 42 })
  total: number;

  @Field(() => Int)
  @ApiProperty({ example: 1 })
  page: number;

  @Field(() => Int)
  @ApiProperty({ example: 20 })
  limit: number;

  @Field(() => Int)
  @ApiProperty({ example: 3 })
  totalPages: number;
}
