import { Module } from "@nestjs/common";
import { GameDataController } from "./gamedata.controller";

@Module({
  imports: [],
  controllers: [GameDataController],
  providers: [],
  exports: [],
})
export class GameDataModule {}
