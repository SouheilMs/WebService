import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { GPSPositionDto } from './dto/gps-position.dto';
import { MovementHistoryQueryDto } from './dto/movement-history-query.dto';
import { PaginatedGpsPositionsDto } from './dto/paginated-gps-positions.dto';
import { PaginatedVehiclesDto } from './dto/paginated-vehicles.dto';
import { SimulateTrackingDto } from './dto/simulate-tracking.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehicleQueryDto } from './dto/vehicle-query.dto';
import { VehicleDto } from './dto/vehicle.dto';
import { VehiclesService } from './vehicles.service';

@Resolver(() => VehicleDto)
export class VehiclesResolver {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Query(() => PaginatedVehiclesDto, { name: 'vehicles' })
  vehicles(@Args() query: VehicleQueryDto): Promise<PaginatedVehiclesDto> {
    return this.vehiclesService.findAll(query);
  }

  @Query(() => VehicleDto, { name: 'vehicle' })
  vehicle(@Args('id') id: string): Promise<VehicleDto> {
    return this.vehiclesService.findById(id);
  }

  @Query(() => PaginatedGpsPositionsDto, { name: 'vehicleMovementHistory' })
  vehicleMovementHistory(
    @Args('vehicleId') vehicleId: string,
    @Args() query: MovementHistoryQueryDto,
  ): Promise<PaginatedGpsPositionsDto> {
    return this.vehiclesService.getMovementHistory(vehicleId, query);
  }

  @Mutation(() => VehicleDto)
  createVehicle(@Args('input') input: CreateVehicleDto): Promise<VehicleDto> {
    return this.vehiclesService.create(input);
  }

  @Mutation(() => VehicleDto)
  updateVehicle(
    @Args('id') id: string,
    @Args('input') input: UpdateVehicleDto,
  ): Promise<VehicleDto> {
    return this.vehiclesService.update(id, input);
  }

  @Mutation(() => Boolean)
  deleteVehicle(@Args('id') id: string): Promise<boolean> {
    return this.vehiclesService.remove(id);
  }

  @Mutation(() => [GPSPositionDto])
  simulateVehicleTracking(
    @Args('vehicleId') vehicleId: string,
    @Args('input', { nullable: true }) input?: SimulateTrackingDto,
  ): Promise<GPSPositionDto[]> {
    return this.vehiclesService.simulateTracking(vehicleId, input);
  }
}
