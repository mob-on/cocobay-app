import { Module } from "@nestjs/common";
import { GameDataController } from "./game-data.controller";

@Module({
  imports: [],
  controllers: [GameDataController],
  providers: [],
  exports: [],
})
export class GameDataModule {}
