import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { PrismaService } from "../prisma/prisma.service";
import { CreateWorkLogDto } from "./dto/create-work-log.dto";
import { GetWorkLogsQueryDto } from "./dto/get-work-logs-query.dto";
import { UpdateWorkLogDto } from "./dto/update-work-log.dto";
import { WorkLogListResponseDto } from "./dto/work-log-list-response.dto";
import { WorkLogResponseDto } from "./dto/work-log-response.dto";

const workLogSelect = {
  id: true,
  performedAt: true,
  quantity: true,
  performer: true,
  comment: true,
  workTypeId: true,
  createdAt: true,
  updatedAt: true,
  workType: {
    select: {
      id: true,
      name: true,
      unit: true,
    },
  },
} satisfies Prisma.WorkLogSelect;

type WorkLogRecord = Prisma.WorkLogGetPayload<{
  select: typeof workLogSelect;
}>;

@Injectable()
export class WorkLogsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: GetWorkLogsQueryDto): Promise<WorkLogListResponseDto> {
    const where = this.buildWhere(query);
    const orderBy = this.buildOrderBy(query);

    const [items, total] = await this.prisma.$transaction([
      this.prisma.workLog.findMany({
        where,
        orderBy,
        select: workLogSelect,
      }),
      this.prisma.workLog.count({ where }),
    ]);

    return {
      items: items.map((item) => this.toResponse(item)),
      total,
    };
  }

  async create(dto: CreateWorkLogDto): Promise<WorkLogResponseDto> {
    await this.ensureWorkTypeExists(dto.workTypeId);

    const created = await this.prisma.workLog.create({
      data: {
        performedAt: this.parseDate(dto.performedAt),
        quantity: new Prisma.Decimal(dto.quantity),
        performer: dto.performer,
        comment: this.normalizeOptionalText(dto.comment),
        workTypeId: dto.workTypeId,
      },
      select: workLogSelect,
    });

    return this.toResponse(created);
  }

  async update(id: string, dto: UpdateWorkLogDto): Promise<WorkLogResponseDto> {
    await this.ensureWorkLogExists(id);

    if (dto.workTypeId) {
      await this.ensureWorkTypeExists(dto.workTypeId);
    }

    const updated = await this.prisma.workLog.update({
      where: { id },
      data: this.buildUpdateData(dto),
      select: workLogSelect,
    });

    return this.toResponse(updated);
  }

  async delete(id: string): Promise<WorkLogResponseDto> {
    await this.ensureWorkLogExists(id);

    const deleted = await this.prisma.workLog.delete({
      where: { id },
      select: workLogSelect,
    });

    return this.toResponse(deleted);
  }

  private buildWhere(query: GetWorkLogsQueryDto): Prisma.WorkLogWhereInput {
    const where: Prisma.WorkLogWhereInput = {};

    if (query.dateFrom || query.dateTo) {
      where.performedAt = {};

      if (query.dateFrom) {
        where.performedAt.gte = this.parseDateBoundary(query.dateFrom, "start");
      }

      if (query.dateTo) {
        where.performedAt.lte = this.parseDateBoundary(query.dateTo, "end");
      }
    }

    if (query.workTypeId) {
      where.workTypeId = query.workTypeId;
    }

    if (query.performer) {
      where.performer = {
        contains: query.performer,
        mode: "insensitive",
      };
    }

    return where;
  }

  private buildOrderBy(
    query: GetWorkLogsQueryDto,
  ): Prisma.WorkLogOrderByWithRelationInput {
    return {
      performedAt: query.sortOrder ?? "desc",
    };
  }

  private buildUpdateData(dto: UpdateWorkLogDto): Prisma.WorkLogUpdateInput {
    const data: Prisma.WorkLogUpdateInput = {};

    if (dto.performedAt !== undefined) {
      data.performedAt = this.parseDate(dto.performedAt);
    }

    if (dto.quantity !== undefined) {
      data.quantity = new Prisma.Decimal(dto.quantity);
    }

    if (dto.performer !== undefined) {
      data.performer = dto.performer;
    }

    if (dto.comment !== undefined) {
      data.comment = this.normalizeOptionalText(dto.comment);
    }

    if (dto.workTypeId !== undefined) {
      data.workType = {
        connect: {
          id: dto.workTypeId,
        },
      };
    }

    return data;
  }

  private async ensureWorkLogExists(id: string) {
    const workLog = await this.prisma.workLog.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!workLog) {
      throw new NotFoundException(`Work log with id "${id}" was not found.`);
    }
  }

  private async ensureWorkTypeExists(id: string) {
    const workType = await this.prisma.workType.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!workType) {
      throw new NotFoundException(`Work type with id "${id}" was not found.`);
    }
  }

  private parseDate(value: string): Date {
    return this.isDateOnly(value)
      ? new Date(`${value}T00:00:00.000Z`)
      : new Date(value);
  }

  private parseDateBoundary(value: string, boundary: "start" | "end"): Date {
    if (!this.isDateOnly(value)) {
      return new Date(value);
    }

    return boundary === "start"
      ? new Date(`${value}T00:00:00.000Z`)
      : new Date(`${value}T23:59:59.999Z`);
  }

  private isDateOnly(value: string): boolean {
    return /^\d{4}-\d{2}-\d{2}$/.test(value);
  }

  private normalizeOptionalText(value: string | undefined): string | null {
    if (value === undefined || value.length === 0) {
      return null;
    }

    return value;
  }

  private toResponse(workLog: WorkLogRecord): WorkLogResponseDto {
    return {
      id: workLog.id,
      performedAt: workLog.performedAt.toISOString().slice(0, 10),
      workTypeId: workLog.workTypeId,
      workType: workLog.workType,
      quantity: Number(workLog.quantity),
      performer: workLog.performer,
      comment: workLog.comment,
      createdAt: workLog.createdAt.toISOString(),
      updatedAt: workLog.updatedAt.toISOString(),
    };
  }
}
