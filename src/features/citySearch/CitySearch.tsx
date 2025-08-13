import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useDebounce } from "@/shared/hooks/useDebounce";
import type { City } from "@/shared/interfaces/city";
import { useCallback, useState } from "react";
import { useCities } from "@/api/useCities";
import { LoadingState, ErrorState, EmptyState } from "@/shared/components";
import { getColor } from "@/shared/helpers";

interface CitySearchProps {
	onCitySelect?: (city: City) => void;
	placeholder?: string;
	className?: string;
}

const CitySearch = ({
	onCitySelect,
	placeholder = "Start typing a city name...",
	className,
}: CitySearchProps) => {
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState("");
	const [searchQuery, setSearchQuery] = useState("");

	const debouncedSearchQuery = useDebounce(searchQuery);
	const { cities, isPending, error } = useCities(debouncedSearchQuery);

	const handleSelect = useCallback(
		(currentValue: string) => {
			setValue(currentValue);
			setOpen(false);

			if (!cities) return;
			const selectedCity = cities.find(
				(city) => city.name === currentValue
			);

			if (!selectedCity || !onCitySelect) return;
			onCitySelect(selectedCity);
		},
		[cities, onCitySelect]
	);

	const renderCommandList = () => {
		if (isPending) {
			return (
				<CommandEmpty>
					<div className="py-6">
						<LoadingState
							title="Searching cities..."
							description="Finding cities that match your search"
							className="!p-6 !shadow-none"
						/>
					</div>
				</CommandEmpty>
			);
		}

		if (debouncedSearchQuery.length < 2) {
			return (
				<CommandEmpty>
					<div className="py-6">
						<EmptyState
							title="Start typing to search"
							description="Type at least 2 characters to search for cities"
							className="!p-6 !shadow-none"
						/>
					</div>
				</CommandEmpty>
			);
		}

		if (error) {
			return (
				<CommandEmpty>
					<div className="py-6">
						<ErrorState
							title="Error loading cities"
							message="Please try again with a different search term"
							className="!p-6 !shadow-none"
						/>
					</div>
				</CommandEmpty>
			);
		}

		if (!cities || cities.length === 0) {
			return (
				<CommandEmpty>
					<div className="py-6">
						<EmptyState
							title="No cities found"
							description="Try searching with a different term"
							className="!p-6 !shadow-none"
						/>
					</div>
				</CommandEmpty>
			);
		}

		return (
			<CommandGroup>
				{cities.map((city) => {
					return (
						<CommandItem
							key={`${city.name}-${city.country}-${city.lat}-${city.lon}`}
							value={city.name}
							onSelect={handleSelect}
						>
							<Check
								className={cn(
									"mr-2 h-4 w-4",
									value === city.name
										? "opacity-100"
										: "opacity-0"
								)}
							/>
							<div className="flex flex-col">
								<span className="font-medium">{city.name}</span>
								<span className="text-xs text-muted-foreground">
									{city.state ? `${city.state}, ` : ""}
									{city.country}
								</span>
							</div>
						</CommandItem>
					);
				})}
			</CommandGroup>
		);
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="default"
					role="combobox"
					aria-expanded={open}
					className={cn(
						"!w-[350px] md:!w-[600px] justify-between",
						!value && "text-muted-foreground",
						className
					)}
				>
					{value || placeholder}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className={cn(
					"!w-[350px] md:!w-[600px] p-0",
					getColor("bg-bg-2")
				)}
				align="start"
			>
				<Command>
					<CommandInput
						placeholder={placeholder}
						value={searchQuery}
						onValueChange={setSearchQuery}
						className="h-9"
					/>
					<CommandList className="w-full">
						{renderCommandList()}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
};

export default CitySearch;
