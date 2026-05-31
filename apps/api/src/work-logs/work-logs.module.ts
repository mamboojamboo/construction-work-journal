import { Module } from "@nestjs/common";

import { PrismaModule } from "../prisma/prisma.module";
import { WorkLogsController } from "./work-logs.controller";
import { WorkLogsService } from "./work-logs.service";

@Module({
  imports: [PrismaModule],
  controllers: [WorkLogsController],
  providers: [WorkLogsService],
})
export class WorkLogsModule {}
