import { CongestionLevel } from '../../common/types';

export class TrafficAlgorithms {
  static calculateDensityPercent(vehicleCount: number, capacity: number): number {
    if (capacity <= 0) {
      return 0;
    }

    const density = (vehicleCount / capacity) * 100;
    return Number(Math.max(0, density).toFixed(2));
  }

  static detectCongestion(
    densityPercent: number,
    averageSpeedKph: number,
    speedLimitKph: number,
    incidentCount = 0,
  ): boolean {
    const normalizedSpeedLimit = Math.max(speedLimitKph, 1);
    const speedRatio = averageSpeedKph / normalizedSpeedLimit;

    return densityPercent >= 65 || speedRatio <= 0.45 || incidentCount > 0;
  }

  static classifyCongestion(densityPercent: number): CongestionLevel {
    if (densityPercent < 40) {
      return CongestionLevel.LOW;
    }

    if (densityPercent < 75) {
      return CongestionLevel.MEDIUM;
    }

    return CongestionLevel.HIGH;
  }

  static generateVehicleCount(
    capacity: number,
    classification: CongestionLevel,
    random: () => number = Math.random,
  ): number {
    const multiplierByLevel: Record<CongestionLevel, [number, number]> = {
      [CongestionLevel.LOW]: [0.1, 0.45],
      [CongestionLevel.MEDIUM]: [0.45, 0.8],
      [CongestionLevel.HIGH]: [0.8, 1.25],
    };

    const [minRatio, maxRatio] = multiplierByLevel[classification];
    const ratio = minRatio + (maxRatio - minRatio) * random();
    return Math.max(0, Math.round(capacity * ratio));
  }

  static generateAverageSpeed(
    speedLimitKph: number,
    classification: CongestionLevel,
    random: () => number = Math.random,
  ): number {
    const ranges: Record<CongestionLevel, [number, number]> = {
      [CongestionLevel.LOW]: [0.65, 0.95],
      [CongestionLevel.MEDIUM]: [0.35, 0.65],
      [CongestionLevel.HIGH]: [0.1, 0.35],
    };

    const [minFactor, maxFactor] = ranges[classification];
    const factor = minFactor + (maxFactor - minFactor) * random();

    return Number((Math.max(speedLimitKph, 5) * factor).toFixed(2));
  }
}
