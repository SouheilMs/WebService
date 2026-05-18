import { Module } from '@nestjs/common';
import { VehiclesController } from './vehicles.controller';
import { VehiclesResolver } from './vehicles.resolver';
import { VehiclesService } from './vehicles.service';

@Module({
  controllers: [VehiclesController],
  providers: [VehiclesService, VehiclesResolver],
})
export class VehiclesModule {}
