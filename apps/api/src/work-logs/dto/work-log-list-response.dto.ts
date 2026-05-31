import { ApiProperty } from "@nestjs/swagger";

import { WorkLogResponseDto } from "./work-log-response.dto";

export class WorkLogListResponseDto {
  @ApiProperty({
    type: WorkLogResponseDto,
    isArray: true,
    description: "Work log records matching the current filters.",
  })
  items!: WorkLogResponseDto[];

  @ApiProperty({
    example: 8,
    description: "Total number of records matching the current filters.",
  })
  total!: number;
}
