interface Picture {
  pictureSrc: string;
}

interface Icon {
  iconSrc: string;
}

interface Avatar {
  avatarSrc: string;
}

// Mapped type to define picture url field name in T
export type WithPictureMapped<K extends keyof T, T = Picture> = {
  [P in K]: T[P];
};

// use this, unless you need a custom field name
export type WithPicture = WithPictureMapped<"pictureSrc", Picture>;
export type WithIcon = WithPictureMapped<"iconSrc", Icon>;
export type WithAvatar = WithPictureMapped<"avatarSrc", Avatar>;
