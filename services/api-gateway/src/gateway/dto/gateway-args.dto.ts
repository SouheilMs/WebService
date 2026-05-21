import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsBooleanString, IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

@ArgsType()
export class VehicleQueryArgs {
  @Field(() => Int, { nullable: true, defaultValue: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @Field(() => Int, { nullable: true, defaultValue: 20 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  type?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  status?: string;
}

@ArgsType()
export class IncidentQueryArgs {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  status?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  severity?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  zoneId?: string;
}

@ArgsType()
export class NotificationQueryArgs {
  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  recipientUserId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBooleanString()
  unreadOnly?: string;
}

@ArgsType()
export class TrafficAnalyticsQueryArgs {
  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  zoneId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  from?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  to?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  classification?: string;
}
