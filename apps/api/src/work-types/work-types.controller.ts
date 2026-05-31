import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

import { WorkTypeResponseDto } from "./dto/work-type-response.dto";
import { WorkTypesService } from "./work-types.service";

@ApiTags("Work types")
@Controller("work-types")
export class WorkTypesController {
  constructor(private readonly workTypesService: WorkTypesService) {}

  @Get()
  @ApiOperation({
    operationId: "getWorkTypes",
    summary: "Get available construction work types",
  })
  @ApiOkResponse({
    description: "List of available work types.",
    type: WorkTypeResponseDto,
    isArray: true,
  })
  getWorkTypes(): Promise<WorkTypeResponseDto[]> {
    return this.workTypesService.findAll();
  }
}
