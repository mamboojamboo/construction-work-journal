import { ApiProperty } from "@nestjs/swagger";
import { Unit } from "@prisma/client";

export class WorkTypeResponseDto {
  @ApiProperty({
    example: "3f2f6b6e-77f7-4f03-8e3e-d2c6f43fbc72",
    description: "Unique work type identifier.",
  })
  id!: string;

  @ApiProperty({
    example: "Бетонирование",
    description: "Human-readable work type name.",
  })
  name!: string;

  @ApiProperty({
    enum: Unit,
    enumName: "Unit",
    example: Unit.M3,
    description: "Measurement unit used for this work type.",
  })
  unit!: Unit;
}
