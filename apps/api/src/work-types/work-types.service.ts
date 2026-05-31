import { Injectable } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import { WorkTypeResponseDto } from "./dto/work-type-response.dto";

@Injectable()
export class WorkTypesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<WorkTypeResponseDto[]> {
    return this.prisma.workType.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        unit: true,
      },
    });
  }
}
