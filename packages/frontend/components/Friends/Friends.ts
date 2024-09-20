export interface IFriend {
  id: number;
  name: string;
  imgSrc: string;
  reward: number;
  profilePic: string;
  // TODO: think about values we might want
  progress: {
    taps: number;
    level: number;
  };
}
