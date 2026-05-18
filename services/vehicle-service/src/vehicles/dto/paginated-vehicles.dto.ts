import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { VehicleDto } from './vehicle.dto';

@ObjectType()
export class PaginatedVehiclesDto {
  @Field(() => [VehicleDto])
  @ApiProperty({ type: () => [VehicleDto] })
  items: VehicleDto[];

  @Field(() => Int)
  @ApiProperty({ example: 42 })
  total: number;

  @Field(() => Int)
  @ApiProperty({ example: 1 })
  page: number;

  @Field(() => Int)
  @ApiProperty({ example: 10 })
  limit: number;

  @Field(() => Int)
  @ApiProperty({ example: 5 })
  totalPages: number;
}
