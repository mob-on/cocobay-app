import { Module } from "@nestjs/common";
import { BuildsController } from "./builds.controller";

@Module({
  imports: [],
  controllers: [BuildsController],
  providers: [],
  exports: [],
})
export class BuildsModule {}
