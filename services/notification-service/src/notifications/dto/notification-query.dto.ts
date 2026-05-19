import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBooleanString, IsOptional, IsString } from 'class-validator';

export class NotificationQueryDto {
  @ApiPropertyOptional({ example: 'operator-123' })
  @IsOptional()
  @IsString()
  recipientUserId?: string;

  @ApiPropertyOptional({ example: 'true' })
  @IsOptional()
  @IsBooleanString()
  unreadOnly?: string;
}
