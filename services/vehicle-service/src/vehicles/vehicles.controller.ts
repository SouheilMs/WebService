import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
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

@ApiTags('vehicles')
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a vehicle' })
  @ApiResponse({ status: 201, type: VehicleDto })
  @ApiResponse({ status: 409, description: 'Vehicle already exists' })
  create(@Body() dto: CreateVehicleDto): Promise<VehicleDto> {
    return this.vehiclesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List vehicles with pagination and filters' })
  @ApiResponse({ status: 200, type: PaginatedVehiclesDto })
  findAll(@Query() query: VehicleQueryDto): Promise<PaginatedVehiclesDto> {
    return this.vehiclesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get vehicle details' })
  @ApiParam({ name: 'id', description: 'Vehicle UUID' })
  @ApiResponse({ status: 200, type: VehicleDto })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<VehicleDto> {
    return this.vehiclesService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update vehicle details' })
  @ApiParam({ name: 'id', description: 'Vehicle UUID' })
  @ApiResponse({ status: 200, type: VehicleDto })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateVehicleDto,
  ): Promise<VehicleDto> {
    return this.vehiclesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Archive a vehicle' })
  @ApiParam({ name: 'id', description: 'Vehicle UUID' })
  @ApiResponse({ status: 204, description: 'Vehicle archived' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.vehiclesService.remove(id);
  }

  @Post(':id/tracking/simulate')
  @ApiTags('tracking')
  @ApiOperation({ summary: 'Generate simulated GPS positions for a vehicle' })
  @ApiParam({ name: 'id', description: 'Vehicle UUID' })
  @ApiResponse({ status: 201, type: [GPSPositionDto] })
  simulateTracking(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: SimulateTrackingDto,
  ): Promise<GPSPositionDto[]> {
    return this.vehiclesService.simulateTracking(id, dto);
  }

  @Get(':id/history')
  @ApiTags('tracking')
  @ApiOperation({ summary: 'Get vehicle movement history' })
  @ApiParam({ name: 'id', description: 'Vehicle UUID' })
  @ApiResponse({ status: 200, type: PaginatedGpsPositionsDto })
  getHistory(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: MovementHistoryQueryDto,
  ): Promise<PaginatedGpsPositionsDto> {
    return this.vehiclesService.getMovementHistory(id, query);
  }
}
