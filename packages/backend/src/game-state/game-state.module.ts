import { Module } from "@nestjs/common";
import { GameStateController } from "./game-state.controller";

@Module({
  imports: [],
  controllers: [GameStateController],
  providers: [],
  exports: [],
})
export class GameStateModule {}
