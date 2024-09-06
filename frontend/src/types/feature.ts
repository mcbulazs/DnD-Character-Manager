export type Feature = {
	id: number;
	characterID: number;
	name: string;
	description: string;
	source: string;
};

export type CreateFeature = {
	name: string;
	description: string;
	source: string;
};
