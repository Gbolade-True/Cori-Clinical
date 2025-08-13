import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import CitySearch from "./CitySearch";
import type { City } from "@/shared/interfaces/city";
import { getColor } from "@/shared/helpers";
import { cn } from "@/lib/utils";

const CitySearchPage = () => {
	const [selectedCity, setSelectedCity] = useState<City | null>(null);
	const navigate = useNavigate();

	const handleCitySelect = useCallback(
		(city: City) => {
			setSelectedCity(city);

			// Navigate to AI recommendations page with city as query params
			const params = new URLSearchParams({
				city: city.name,
				country: city.country,
				lat: city.lat.toString(),
				lon: city.lon.toString(),
			});

			if (city.state) {
				params.append("state", city.state);
			}

			navigate(`/recommendations?${params.toString()}`);
		},
		[navigate]
	);

	return (
		<div className="min-h-screen p-8">
			<div className="mx-auto max-w-2xl">
				<div
					className={cn(
						"rounded-lg p-8 shadow-lg",
						getColor("bg-bg-2")
					)}
				>
					<h1 className="mb-2 text-3xl font-bold">City Search</h1>
					<p className="mb-8">
						Search for cities around the world with real-time
						suggestions
					</p>

					<div className="space-y-6">
						<div>
							<label className="mb-2 block text-sm font-medium">
								Select a City
							</label>
							<CitySearch
								onCitySelect={handleCitySelect}
								className="w-full"
							/>
						</div>

						{selectedCity && (
							<div
								className={cn(
									"rounded-lg p-4",
									getColor("bg-bg-2")
								)}
							>
								<h3 className="mb-2 text-lg font-semibold">
									Selected City
								</h3>
								<div className="space-y-1 text-sm">
									<p>
										<strong>Name:</strong>{" "}
										{selectedCity.name}
									</p>
									<p>
										<strong>Country:</strong>{" "}
										{selectedCity.country}
									</p>
									{selectedCity.state && (
										<p>
											<strong>State/Region:</strong>{" "}
											{selectedCity.state}
										</p>
									)}
									<p>
										<strong>Coordinates:</strong>{" "}
										{selectedCity.lat.toFixed(4)},{" "}
										{selectedCity.lon.toFixed(4)}
									</p>
								</div>
								<div className="mt-4">
									<p className="text-sm">
										🎉 Redirecting to AI recommendations...
									</p>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default CitySearchPage;
