import { ValidateNested } from "class-validator";
import { GameDataDto } from "../game-data.dto";

function IsGameData() {
  return function (target: object, propertyKey: string) {
    ValidateNested()(target, propertyKey);
  };
}

export class ApiResponseDto {
  @IsGameData()
  gameData!: GameDataDto;

  constructor({ gameData }: Partial<ApiResponseDto> = {}) {
    if (gameData) this.gameData = gameData;
  }
}
