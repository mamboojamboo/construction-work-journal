import { Transform, Type } from "class-transformer";
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateWorkLogDto {
  @ApiProperty({
    example: "2026-05-30",
    format: "date",
    description: "Date when the work was performed.",
  })
  @IsDateString({}, { message: "Performed date must be a valid ISO date." })
  performedAt!: string;

  @ApiProperty({
    example: "3f2f6b6e-77f7-4f03-8e3e-d2c6f43fbc72",
    description: "Existing work type identifier.",
  })
  @IsUUID("4", { message: "Work type id must be a valid UUID." })
  workTypeId!: string;

  @ApiProperty({
    example: 24,
    minimum: 0.01,
    description: "Completed work quantity. Must be greater than zero.",
  })
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: "Quantity must be a number with up to 2 decimal places." },
  )
  @IsPositive({ message: "Quantity must be greater than zero." })
  quantity!: number;

  @ApiProperty({
    example: "Иванов Иван Иванович",
    minLength: 2,
    maxLength: 160,
    description: "Full name of the performer.",
  })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === "string" ? value.trim() : value,
  )
  @IsString({ message: "Performer must be a string." })
  @MinLength(2, { message: "Performer must contain at least 2 characters." })
  @MaxLength(160, { message: "Performer must be at most 160 characters." })
  performer!: string;

  @ApiPropertyOptional({
    example: "Работы выполнены на секции А",
    maxLength: 1000,
    description: "Optional supervisor comment.",
  })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === "string" ? value.trim() : value,
  )
  @IsOptional()
  @IsString({ message: "Comment must be a string." })
  @MaxLength(1000, { message: "Comment must be at most 1000 characters." })
  comment?: string;
}
