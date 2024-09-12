import coco from "frontend/public/media/coco/coco-pink-swag.svg";

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

export const defaultFriends: IFriend[] = [
  {
    id: 0,
    name: "Voldemort",
    imgSrc: coco,
    reward: 5000,
    profilePic: coco,
    progress: {
      taps: 100,
      level: 0,
    },
  },
  {
    id: 1,
    name: "Harry",
    imgSrc: coco,
    reward: 5000,
    profilePic: coco,
    progress: {
      taps: 245000,
      level: 2,
    },
  },
  {
    id: 2,
    name: "Hagrid",
    imgSrc: coco,
    reward: 5000,
    profilePic: coco,
    progress: {
      taps: 1512591231,
      level: 5,
    },
  },
  {
    id: 2,
    name: "Hermione",
    imgSrc: coco,
    reward: 25000,
    profilePic: coco,
    progress: {
      taps: 231259123,
      level: 5,
    },
  },
];
