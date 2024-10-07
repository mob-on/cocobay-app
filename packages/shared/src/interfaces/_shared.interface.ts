export interface WithPicture {
  pictureSrc: string;
}

export interface WithIcon {
  iconSrc: string;
}

export interface WithAvatar {
  avatarSrc: string;
}

export type WithCurrentPoints<T> = T & { currentPoints: number };
