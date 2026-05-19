import { ApiPropertyOptional } from '@nestjs/swagger';
import { IncidentStatus, IncidentType } from '@traffic-platform/shared';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';

export class IncidentQueryDto {
  @ApiPropertyOptional({ enum: IncidentType, enumName: 'IncidentType' })
  @IsOptional()
  @IsEnum(IncidentType)
  type?: IncidentType;

  @ApiPropertyOptional({ enum: IncidentStatus, enumName: 'IncidentStatus' })
  @IsOptional()
  @IsEnum(IncidentStatus)
  status?: IncidentStatus;

  @ApiPropertyOptional({ example: 25, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}
