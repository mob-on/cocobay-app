import { IsISO8601, IsNotEmpty, IsNumber } from "class-validator";

export class TapDto {
  @IsNumber()
  @IsNotEmpty()
  tapCountPending!: number;

  @IsISO8601({ strict: true })
  @IsNotEmpty()
  timestamp!: string;

  constructor({ tapCountPending, timestamp }: TapDto = {} as TapDto) {
    // if (availableTaps) this.availableTaps = availableTaps;
    if (tapCountPending) this.tapCountPending = tapCountPending;
    if (timestamp) this.timestamp = timestamp;
  }
}
