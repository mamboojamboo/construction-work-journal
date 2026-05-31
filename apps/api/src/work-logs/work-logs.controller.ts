import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";

import { CreateWorkLogDto } from "./dto/create-work-log.dto";
import { GetWorkLogsQueryDto } from "./dto/get-work-logs-query.dto";
import { UpdateWorkLogDto } from "./dto/update-work-log.dto";
import { WorkLogListResponseDto } from "./dto/work-log-list-response.dto";
import { WorkLogResponseDto } from "./dto/work-log-response.dto";
import { WorkLogsService } from "./work-logs.service";

@ApiTags("Work logs")
@Controller("work-logs")
export class WorkLogsController {
  constructor(private readonly workLogsService: WorkLogsService) {}

  @Get()
  @ApiOperation({
    operationId: "getWorkLogs",
    summary: "Get construction work log records",
  })
  @ApiOkResponse({
    description: "Filtered and sorted work log records.",
    type: WorkLogListResponseDto,
  })
  @ApiBadRequestResponse({
    description: "Invalid filters or sorting query.",
  })
  getWorkLogs(
    @Query() query: GetWorkLogsQueryDto,
  ): Promise<WorkLogListResponseDto> {
    return this.workLogsService.findAll(query);
  }

  @Post()
  @ApiOperation({
    operationId: "createWorkLog",
    summary: "Create a construction work log record",
  })
  @ApiCreatedResponse({
    description: "Work log record was created.",
    type: WorkLogResponseDto,
  })
  @ApiBadRequestResponse({
    description: "Invalid request body.",
  })
  @ApiNotFoundResponse({
    description: "Referenced work type does not exist.",
  })
  createWorkLog(@Body() dto: CreateWorkLogDto): Promise<WorkLogResponseDto> {
    return this.workLogsService.create(dto);
  }

  @Patch(":id")
  @ApiOperation({
    operationId: "updateWorkLog",
    summary: "Update a construction work log record",
  })
  @ApiParam({
    name: "id",
    format: "uuid",
    description: "Work log identifier.",
  })
  @ApiOkResponse({
    description: "Work log record was updated.",
    type: WorkLogResponseDto,
  })
  @ApiBadRequestResponse({
    description: "Invalid id or request body.",
  })
  @ApiNotFoundResponse({
    description: "Work log or referenced work type does not exist.",
  })
  updateWorkLog(
    @Param("id", new ParseUUIDPipe({ version: "4" })) id: string,
    @Body() dto: UpdateWorkLogDto,
  ): Promise<WorkLogResponseDto> {
    return this.workLogsService.update(id, dto);
  }

  @Delete(":id")
  @ApiOperation({
    operationId: "deleteWorkLog",
    summary: "Delete a construction work log record",
  })
  @ApiParam({
    name: "id",
    format: "uuid",
    description: "Work log identifier.",
  })
  @ApiOkResponse({
    description: "Work log record was deleted.",
    type: WorkLogResponseDto,
  })
  @ApiBadRequestResponse({
    description: "Invalid id.",
  })
  @ApiNotFoundResponse({
    description: "Work log does not exist.",
  })
  deleteWorkLog(
    @Param("id", new ParseUUIDPipe({ version: "4" })) id: string,
  ): Promise<WorkLogResponseDto> {
    return this.workLogsService.delete(id);
  }
}
