import type { backgroundImageProps } from "./backgroundImageProps";

export default interface characterCard {
	ID: number;
	image?: backgroundImageProps;
	name?: string;
	class?: string;
	isFavorite?: boolean;
}
