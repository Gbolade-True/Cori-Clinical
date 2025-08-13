import { Star, Clock, DollarSign, MapPin } from "lucide-react";
import type { Recommendation } from "@/shared/interfaces/recommendation";

interface Category {
	id: string;
	name: string;
	icon: string;
}

interface RecommendationsGridProps {
	recommendations: Recommendation[];
	categories: Category[];
}

const RecommendationsGrid = ({
	recommendations,
	categories,
}: RecommendationsGridProps) => {
	const getCategoryIcon = (category: string) => {
		const cat = categories.find((c) => c.id === category);
		return cat?.icon || "��";
	};

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{recommendations.map((recommendation, index) => (
				<div
					key={index}
					className="rounded-lg bg-white p-6 shadow-lg hover:shadow-xl transition-shadow"
				>
					<div className="flex items-start justify-between mb-3">
						<div className="flex items-center gap-2">
							<span className="text-2xl">
								{getCategoryIcon(recommendation.category)}
							</span>
							<span className="text-sm font-medium text-blue-600 uppercase tracking-wide">
								{
									categories.find(
										(c) => c.id === recommendation.category
									)?.name
								}
							</span>
						</div>
						{recommendation.rating && (
							<div className="flex items-center gap-1">
								<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
								<span className="text-sm font-medium">
									{recommendation.rating}
								</span>
							</div>
						)}
					</div>

					<h3 className="text-xl font-bold text-gray-900 mb-2">
						{recommendation.name}
					</h3>

					<p className="text-gray-600 mb-4 line-clamp-3">
						{recommendation.description}
					</p>

					<div className="space-y-2 mb-4">
						{recommendation.price && (
							<div className="flex items-center gap-2 text-sm text-gray-600">
								<DollarSign className="h-4 w-4" />
								<span>{recommendation.price}</span>
							</div>
						)}
						{recommendation.hours && (
							<div className="flex items-center gap-2 text-sm text-gray-600">
								<Clock className="h-4 w-4" />
								<span>{recommendation.hours}</span>
							</div>
						)}
						{recommendation.location && (
							<div className="flex items-center gap-2 text-sm text-gray-600">
								<MapPin className="h-4 w-4" />
								<span>{recommendation.location}</span>
							</div>
						)}
					</div>

					{recommendation.tips && recommendation.tips.length > 0 && (
						<div>
							<h4 className="font-semibold text-gray-900 mb-2">
								Pro Tips:
							</h4>
							<ul className="space-y-1">
								{recommendation.tips.map((tip, tipIndex) => (
									<li
										key={tipIndex}
										className="text-sm text-gray-600 flex items-start gap-2"
									>
										<span className="text-blue-600 mt-1">
											•
										</span>
										{tip}
									</li>
								))}
							</ul>
						</div>
					)}
				</div>
			))}
		</div>
	);
};

export default RecommendationsGrid;
