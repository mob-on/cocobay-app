import { Module } from "@nestjs/common";
import { GameDataController } from "./controller/gamedata.controller";

@Module({
  imports: [],
  controllers: [GameDataController],
  providers: [],
  exports: [],
})
export class GameDataModule {}
