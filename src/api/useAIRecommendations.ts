import type { Recommendation } from "@/shared/interfaces/recommendation";
import { useFetch } from "../shared/hooks/useFetch";
import { AI_SUGGESTIONS_API_URL } from "@/shared/constants";

interface UseAIRecommendationsProps {
	city: string;
	lat: number;
	lon: number;
	category?: string;
}

export const useAIRecommendations = ({
	city,
	lat,
	lon,
	category,
}: UseAIRecommendationsProps) => {
	const { data, isPending, error, refetch } = useFetch<Recommendation[]>(
		`${AI_SUGGESTIONS_API_URL}?city=${city}&lat=${lat}&lon=${lon}${
			category ? `&category=${category}` : ""
		}&limit=${10}`
	);

	return {
		recommendations: data,
		isPending,
		error,
		refetch,
	};
};
