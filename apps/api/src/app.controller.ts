import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

type HealthResponse = {
  status: "ok";
  service: "construction-work-journal-api";
};

@ApiTags("Health")
@Controller()
export class AppController {
  @Get("health")
  @ApiOperation({ operationId: "getHealth", summary: "Check API health" })
  @ApiOkResponse({
    description: "API is running",
    schema: {
      example: {
        status: "ok",
        service: "construction-work-journal-api",
      },
    },
  })
  getHealth(): HealthResponse {
    return {
      status: "ok",
      service: "construction-work-journal-api",
    };
  }
}
