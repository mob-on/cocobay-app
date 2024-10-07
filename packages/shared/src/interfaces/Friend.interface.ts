import { WithAvatar } from "./_shared.interface";

export interface Friend extends WithAvatar {
  id: string;
  username: string;
  collectedReward: number;
  progress: {
    points: number;
    level: number;
  };
}
