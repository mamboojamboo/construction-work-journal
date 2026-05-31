import { ApiProperty } from "@nestjs/swagger";

import { WorkTypeResponseDto } from "../../work-types/dto/work-type-response.dto";

export class WorkLogResponseDto {
  @ApiProperty({
    example: "df147802-fc6c-40bb-a4df-c14229b75a72",
    description: "Unique work log identifier.",
  })
  id!: string;

  @ApiProperty({
    example: "2026-05-30",
    format: "date",
    description: "Date when the work was performed.",
  })
  performedAt!: string;

  @ApiProperty({
    example: "3f2f6b6e-77f7-4f03-8e3e-d2c6f43fbc72",
    description: "Related work type identifier.",
  })
  workTypeId!: string;

  @ApiProperty({
    type: WorkTypeResponseDto,
    description: "Related work type dictionary entry.",
  })
  workType!: WorkTypeResponseDto;

  @ApiProperty({
    example: 24,
    description: "Completed work quantity.",
  })
  quantity!: number;

  @ApiProperty({
    example: "Иванов Иван Иванович",
    description: "Full name of the performer.",
  })
  performer!: string;

  @ApiProperty({
    type: String,
    example: "Работы выполнены на секции А",
    nullable: true,
    description: "Optional supervisor comment.",
  })
  comment!: string | null;

  @ApiProperty({
    example: "2026-05-31T04:00:00.000Z",
    format: "date-time",
    description: "Record creation timestamp.",
  })
  createdAt!: string;

  @ApiProperty({
    example: "2026-05-31T04:00:00.000Z",
    format: "date-time",
    description: "Record update timestamp.",
  })
  updatedAt!: string;
}
