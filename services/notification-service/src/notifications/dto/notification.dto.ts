import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NotificationType } from '@traffic-platform/shared';

export class NotificationDto {
  @ApiProperty({ example: 'dffa394e-f38d-48f8-bef5-3a2548f8f2cb' })
  id: string;

  @ApiPropertyOptional({ example: 'operator-123' })
  recipientUserId?: string | null;

  @ApiProperty({ example: 'Incident update' })
  title: string;

  @ApiProperty({ example: 'Incident status changed to IN_PROGRESS.' })
  message: string;

  @ApiProperty({ enum: NotificationType, enumName: 'NotificationType' })
  type: NotificationType;

  @ApiPropertyOptional({ example: '817646ac-0b9d-4341-b2a1-0d46495cef04' })
  incidentId?: string | null;

  @ApiPropertyOptional({ example: { source: 'incident-service' } })
  metadata?: Record<string, unknown> | null;

  @ApiPropertyOptional({ example: '2026-05-19T11:10:00.000Z' })
  readAt?: Date | null;

  @ApiProperty({ example: '2026-05-19T10:20:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-05-19T10:20:00.000Z' })
  updatedAt: Date;
}
