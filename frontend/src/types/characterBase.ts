import type { BackgroundImageProps } from "./backgroundImageProps";

export interface CharacterBase {
  ID: number;
  image: BackgroundImageProps;
  name: string;
  class: string;
  isFavorite: boolean;
}
export interface CreateCharacterBase {
  image?: BackgroundImageProps;
  name?: string;
  class?: string;
}
