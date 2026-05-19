import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IncidentType } from '@traffic-platform/shared';
import { IsEnum, IsLatitude, IsLongitude, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateIncidentDto {
  @ApiProperty({ example: 'Major collision near downtown intersection' })
  @IsString()
  @MaxLength(160)
  title: string;

  @ApiPropertyOptional({ example: 'Two vehicles involved and lane blocked.' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiProperty({ enum: IncidentType, enumName: 'IncidentType' })
  @IsEnum(IncidentType)
  type: IncidentType;

  @ApiProperty({ example: 36.8065 })
  @IsLatitude()
  latitude: number;

  @ApiProperty({ example: 10.1815 })
  @IsLongitude()
  longitude: number;

  @ApiPropertyOptional({ example: 'operator-123' })
  @IsOptional()
  @IsString()
  reportedByUserId?: string;
}
