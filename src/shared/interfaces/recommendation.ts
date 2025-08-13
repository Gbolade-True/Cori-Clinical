export interface Recommendation {
	category: string;
	name: string;
	description: string;
	rating?: number;
	price?: string;
	hours?: string;
	location?: string;
	tips?: string[];
}
