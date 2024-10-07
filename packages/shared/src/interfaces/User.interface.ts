import { WithAvatar } from "./_shared.interface";

export interface User extends Partial<WithAvatar> {
  id: string;
  firstName?: string;
  username?: string;
  languageCode?: string;
}
