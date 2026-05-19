import { registerEnumType } from '@nestjs/graphql';

export enum CongestionLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

registerEnumType(CongestionLevel, {
  name: 'CongestionLevel',
});
