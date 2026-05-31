import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { PrismaModule } from "./prisma/prisma.module";
import { WorkLogsModule } from "./work-logs/work-logs.module";
import { WorkTypesModule } from "./work-types/work-types.module";

@Module({
  imports: [PrismaModule, WorkTypesModule, WorkLogsModule],
  controllers: [AppController],
})
export class AppModule {}
