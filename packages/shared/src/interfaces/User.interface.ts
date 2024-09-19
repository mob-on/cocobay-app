import { WithAvatar } from "./_shared";

export interface User extends Partial<WithAvatar> {
  id: string;
  firstName?: string;
  username?: string;
  languageCode?: string;
}
