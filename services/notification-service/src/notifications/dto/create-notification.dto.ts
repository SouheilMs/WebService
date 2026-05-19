import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NotificationType } from '@traffic-platform/shared';
import { IsEnum, IsObject, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateNotificationDto {
  @ApiPropertyOptional({ example: 'operator-123' })
  @IsOptional()
  @IsString()
  recipientUserId?: string;

  @ApiProperty({ example: 'Incident update' })
  @IsString()
  @MaxLength(120)
  title: string;

  @ApiProperty({ example: 'Incident status changed to IN_PROGRESS.' })
  @IsString()
  @MaxLength(1000)
  message: string;

  @ApiProperty({ enum: NotificationType, enumName: 'NotificationType' })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiPropertyOptional({ example: '817646ac-0b9d-4341-b2a1-0d46495cef04' })
  @IsOptional()
  @IsString()
  incidentId?: string;

  @ApiPropertyOptional({ example: { source: 'incident-service' } })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
