import type { City } from "@/shared/interfaces/city";
import { useFetch } from "../shared/hooks/useFetch";
import { CITIES_API_URL } from "@/shared/constants";

export const mockCities: City[] = [
	{
		name: "London",
		country: "United Kingdom",
		lat: 51.5074,
		lon: -0.1278,
	},
];

export const useCities = (searchQuery: string) => {
	const { data, isPending, error } = useFetch<City[]>(
		searchQuery.length >= 2
			? `${CITIES_API_URL}?name=${searchQuery}&limit=10`
			: "",
		{
			skip: searchQuery.length < 2,
			headers: { Accept: "application/json" },
		}
	);

	return { cities: data, isPending, error };
};
