import { UserDto } from "../user.dto";

export interface TelegramJwtDto {
  user: UserDto;
  token: string;
}
