import { registerEnumType } from '@nestjs/graphql';

export enum VehicleType {
  CAR = 'CAR',
  BUS = 'BUS',
  TRUCK = 'TRUCK',
  MOTORCYCLE = 'MOTORCYCLE',
  EMERGENCY = 'EMERGENCY',
}

export enum VehicleStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  MAINTENANCE = 'MAINTENANCE',
}

export enum PositionSource {
  MANUAL = 'MANUAL',
  SIMULATED = 'SIMULATED',
}

registerEnumType(VehicleType, {
  name: 'VehicleType',
});

registerEnumType(VehicleStatus, {
  name: 'VehicleStatus',
});

registerEnumType(PositionSource, {
  name: 'PositionSource',
});
