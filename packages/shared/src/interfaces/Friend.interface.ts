import { WithAvatar } from "./_shared";

export interface Friend extends WithAvatar {
  id: string;
  username: string;
  collectedReward: number;
  progress: {
    points: number;
    level: number;
  };
}
