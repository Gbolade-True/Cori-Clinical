import type { City } from "@/shared/interfaces/city";
import type { Recommendation } from "@/shared/interfaces/recommendation";

export const mockCity: City = {
	name: "New York",
	country: "United States",
	state: "New York",
	lat: 40.7128,
	lon: -74.006,
};

export const mockCityWithoutState: City = {
	name: "London",
	country: "United Kingdom",
	lat: 51.5074,
	lon: -0.1278,
};

export const mockRecommendations: Recommendation[] = [
	{
		category: "activity",
		name: "Central Park",
		description: "Located in New York",
		rating: 4.5,
		price: "Free",
		location: "Manhattan, NY",
		tips: [
			"Best time to visit is early morning",
			"Bring comfortable walking shoes",
		],
	},
	{
		category: "entertainment",
		name: "Broadway Show",
		description: "Located in New York",
		rating: 4.8,
		price: "$$$",
		location: "Times Square, NY",
		tips: [
			"Book tickets in advance",
			"Dress appropriately for the theater",
		],
	},
];

export const mockCategories = [
	{ id: "activity", name: "Activity", icon: "🎯" },
	{ id: "entertainment", name: "Entertainment", icon: "🎬" },
	{ id: "tourism", name: "Tourism", icon: "🏛️" },
];
