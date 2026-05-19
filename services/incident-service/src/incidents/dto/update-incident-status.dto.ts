import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IncidentStatus } from '@traffic-platform/shared';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateIncidentStatusDto {
  @ApiProperty({ enum: IncidentStatus, enumName: 'IncidentStatus' })
  @IsEnum(IncidentStatus)
  status: IncidentStatus;

  @ApiPropertyOptional({ example: 'Team dispatched and lane secured.' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}
