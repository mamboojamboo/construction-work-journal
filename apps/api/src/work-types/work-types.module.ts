import { Module } from "@nestjs/common";

import { PrismaModule } from "../prisma/prisma.module";
import { WorkTypesController } from "./work-types.controller";
import { WorkTypesService } from "./work-types.service";

@Module({
  imports: [PrismaModule],
  controllers: [WorkTypesController],
  providers: [WorkTypesService],
})
export class WorkTypesModule {}
