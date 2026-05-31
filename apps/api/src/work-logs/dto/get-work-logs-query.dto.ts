import { Transform } from "class-transformer";
import {
  IsDateString,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class GetWorkLogsQueryDto {
  @ApiPropertyOptional({
    example: "2026-05-01",
    format: "date",
    description: "Inclusive lower performed date boundary.",
  })
  @IsOptional()
  @IsDateString({}, { message: "Date from must be a valid ISO date." })
  dateFrom?: string;

  @ApiPropertyOptional({
    example: "2026-05-30",
    format: "date",
    description: "Inclusive upper performed date boundary.",
  })
  @IsOptional()
  @IsDateString({}, { message: "Date to must be a valid ISO date." })
  dateTo?: string;

  @ApiPropertyOptional({
    example: "3f2f6b6e-77f7-4f03-8e3e-d2c6f43fbc72",
    description: "Filter by work type identifier.",
  })
  @IsOptional()
  @IsUUID("4", { message: "Work type id must be a valid UUID." })
  workTypeId?: string;

  @ApiPropertyOptional({
    example: "Иванов",
    maxLength: 160,
    description: "Case-insensitive performer name search.",
  })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === "string" ? value.trim() : value,
  )
  @IsOptional()
  @IsString({ message: "Performer filter must be a string." })
  @MaxLength(160, {
    message: "Performer filter must be at most 160 characters.",
  })
  performer?: string;

  @ApiPropertyOptional({
    enum: ["performedAt"],
    example: "performedAt",
    description: "Field used for sorting.",
  })
  @IsOptional()
  @IsIn(["performedAt"], { message: "Sort by supports performedAt only." })
  sortBy?: "performedAt";

  @ApiPropertyOptional({
    enum: ["asc", "desc"],
    example: "desc",
    description: "Date sort direction.",
  })
  @IsOptional()
  @IsIn(["asc", "desc"], { message: "Sort order must be asc or desc." })
  sortOrder?: "asc" | "desc";
}
