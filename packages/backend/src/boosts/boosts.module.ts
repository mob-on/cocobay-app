import { Module } from "@nestjs/common";
import { BoostsController } from "./boosts.controller";

@Module({
  imports: [],
  controllers: [BoostsController],
  providers: [],
  exports: [],
})
export class BoostsModule {}
