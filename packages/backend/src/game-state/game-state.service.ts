import { Injectable } from "@nestjs/common";
import type { GameState, UpgradeableBoost } from "@shared/src/interfaces";
import { getTempGameData } from "src/_tempGameData";

@Injectable()
export class GameStateService {
  async getGameState(userId: string): Promise<GameState> {
    return getTempGameData().gameState;
  }

  async saveGameState(
    userId: string,
    gameState: GameState,
  ): Promise<GameState> {
    return Promise.resolve(gameState);
  }

  async updateGameStateForBoostUpgrade(
    userId: string,
    updatedBoost: UpgradeableBoost,
  ): Promise<GameState> {
    const gameState = await this.getGameState(userId);

    switch (updatedBoost.action) {
      case "PERMANENT_TAP_BOOST":
        gameState.pointsPerTap += 1;
        break;
      case "PERMANENT_ENERGY_BOOST":
        gameState.maxEnergy += 500;
        break;
    }

    return await this.saveGameState(userId, gameState);
  }
}
