import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IncidentStatus, IncidentType } from '@traffic-platform/shared';

export class IncidentDto {
  @ApiProperty({ example: '8f7ca2f0-19cc-48f1-b9ce-b212592a6f6c' })
  id: string;

  @ApiProperty({ example: 'Major collision near downtown intersection' })
  title: string;

  @ApiPropertyOptional({ example: 'Two vehicles involved and lane blocked.' })
  description?: string | null;

  @ApiProperty({ enum: IncidentType, enumName: 'IncidentType' })
  type: IncidentType;

  @ApiProperty({ enum: IncidentStatus, enumName: 'IncidentStatus' })
  status: IncidentStatus;

  @ApiProperty({ example: 36.8065 })
  latitude: number;

  @ApiProperty({ example: 10.1815 })
  longitude: number;

  @ApiPropertyOptional({ example: 'operator-123' })
  reportedByUserId?: string | null;

  @ApiProperty({ example: '2026-05-19T10:20:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-05-19T10:45:00.000Z' })
  updatedAt: Date;

  @ApiPropertyOptional({ example: '2026-05-19T11:10:00.000Z' })
  resolvedAt?: Date | null;
}
