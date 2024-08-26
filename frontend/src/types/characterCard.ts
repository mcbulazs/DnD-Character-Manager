import type { BackgroundImageProps } from "./backgroundImageProps";

export default interface CharacterCard {
	ID: number;
	image?: BackgroundImageProps;
	name?: string;
	class?: string;
	is_favorite?: boolean;
}
