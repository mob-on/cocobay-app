import { UserDto } from "@shared/src/dto/user.dto";

export interface TelegramJwtPayload {
  user: UserDto;
  token: string;
}
