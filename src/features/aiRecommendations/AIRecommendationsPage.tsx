import { useCallback, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin } from "lucide-react";
import type { City } from "@/shared/interfaces/city";
import { useAIRecommendations } from "@/api/useAIRecommendations";
import RecommendationsGrid from "./RecommendationsGrid";
import CategoryFilter from "./CategoryFilter";
import { LoadingState, ErrorState, EmptyState } from "@/shared/components";

interface AIRecommendationsPageProps {
	city?: City;
}

const FALLBACK_LAT = 40.7128;
const FALLBACK_LON = -74.006;

const CATEGORIES = [
	{ id: "activity", name: "Activity", icon: "🎯" },
	{ id: "commercial", name: "Commercial", icon: "🛍️" },
	{ id: "commercial.shopping_mall", name: "Shopping", icon: "🛍️" },
	{ id: "entertainment", name: "Entertainment", icon: "🎬" },
	{ id: "beach", name: "Beach", icon: "🏖️" },
	{ id: "outdoor", name: "Outdoor", icon: "🌳" },
	{ id: "tourism", name: "Tourism", icon: "🏛️" },
	{ id: "sport", name: "Sport", icon: "🏆" },
];

const AIRecommendationsPage = ({ city }: AIRecommendationsPageProps) => {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const [selectedCategory, setSelectedCategory] = useState<string>(
		CATEGORIES[0].id
	);

	const cityName = searchParams.get("city") || city?.name || "";
	const cityCountry = searchParams.get("country") || city?.country;
	const cityLat = searchParams.get("lat") || city?.lat || FALLBACK_LAT;
	const cityLon = searchParams.get("lon") || city?.lon || FALLBACK_LON;

	const { recommendations, isPending, error, refetch } = useAIRecommendations(
		{
			city: cityName,
			lat: Number(cityLat),
			lon: Number(cityLon),
			category: selectedCategory,
		}
	);

	const handleBack = useCallback(() => {
		navigate("/");
	}, [navigate]);

	if (!cityName) {
		return (
			<div className="min-h-screen bg-gradient-purple-pink p-8 rounded-xl">
				<div className="mx-auto max-w-4xl">
					<div className="rounded-lg p-8 shadow-lg text-center">
						<h1 className="text-2xl font-bold mb-4">
							No City Selected
						</h1>
						<p className="text-gray-600 mb-6">
							Please select a city to get AI recommendations.
						</p>
						<Button
							onClick={handleBack}
							className="bg-blue-600 hover:bg-blue-700 text-white hover:text-white"
						>
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to City Search
						</Button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-purple-pink p-8 rounded-xl">
			<div className="mx-auto max-w-6xl">
				<div className="mb-8">
					<Button
						onClick={handleBack}
						variant="ghost"
						className="mb-4 hover:bg-white/50"
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to City Search
					</Button>

					<div className="rounded-lg p-6 shadow-lg">
						<div className="flex items-center gap-3 mb-4">
							<MapPin className="h-6 w-6 text-blue-600" />
							<h1 className="text-3xl font-bold">
								AI Recommendations for {cityName}
							</h1>
						</div>
						{cityCountry && (
							<p className=" text-lg">
								Discover the best places to visit in {cityName},{" "}
								{cityCountry}
							</p>
						)}
					</div>
				</div>

				<CategoryFilter
					categories={CATEGORIES}
					selectedCategory={selectedCategory}
					onCategoryChange={setSelectedCategory}
				/>

				{/* Loading State */}
				{isPending && (
					<LoadingState
						title="Getting AI Recommendations..."
						description={`Our AI is analyzing ${cityName} to find the best places for you`}
					/>
				)}

				{/* Error State */}
				{error && (
					<ErrorState message={error.message} onRetry={refetch} />
				)}

				{/* Recommendations Grid */}
				{!isPending && !error && (
					<RecommendationsGrid
						recommendations={recommendations || []}
						categories={CATEGORIES}
					/>
				)}

				{/* No Results */}
				{!isPending && !error && recommendations?.length === 0 && (
					<EmptyState
						title="No recommendations found"
						description="Try selecting a different category or check back later for more recommendations."
					/>
				)}
			</div>
		</div>
	);
};

export default AIRecommendationsPage;
