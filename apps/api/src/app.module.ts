import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { PrismaModule } from "./prisma/prisma.module";
import { WorkTypesModule } from "./work-types/work-types.module";

@Module({
  imports: [PrismaModule, WorkTypesModule],
  controllers: [AppController],
})
export class AppModule {}
