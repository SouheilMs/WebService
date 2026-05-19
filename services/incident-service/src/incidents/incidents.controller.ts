import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { IncidentDto } from './dto/incident.dto';
import { IncidentQueryDto } from './dto/incident-query.dto';
import { UpdateIncidentStatusDto } from './dto/update-incident-status.dto';
import { IncidentsService } from './incidents.service';

@ApiTags('incidents')
@Controller('incidents')
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Declare a traffic incident' })
  @ApiResponse({ status: 201, type: IncidentDto })
  declare(@Body() dto: CreateIncidentDto): Promise<IncidentDto> {
    return this.incidentsService.declareIncident(dto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update incident lifecycle status' })
  @ApiParam({ name: 'id', description: 'Incident UUID' })
  @ApiResponse({ status: 200, type: IncidentDto })
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateIncidentStatusDto,
  ): Promise<IncidentDto> {
    return this.incidentsService.updateStatus(id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List incidents with optional filters' })
  @ApiResponse({ status: 200, type: [IncidentDto] })
  list(@Query() query: IncidentQueryDto): Promise<IncidentDto[]> {
    return this.incidentsService.listIncidents(query);
  }
}
