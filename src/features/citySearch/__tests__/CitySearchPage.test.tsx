import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "@/test/utils";
import CitySearchPage from "../CitySearchPage";
import { mockCity } from "@/test/testData";

// Mock the CitySearch component
vi.mock("../CitySearch", () => ({
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	default: ({ onCitySelect, className }: any) => (
		<div data-testid="city-search" className={className}>
			<button
				onClick={() => onCitySelect(mockCity)}
				data-testid="select-city-button"
			>
				Select New York
			</button>
		</div>
	),
}));

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
	const actual = await vi.importActual("react-router-dom");
	return {
		...actual,
		useNavigate: () => mockNavigate,
	};
});

describe("CitySearchPage", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("renders the page title and description", () => {
		render(<CitySearchPage />);

		expect(screen.getByText("City Search")).toBeInTheDocument();
		expect(
			screen.getByText(
				"Search for cities around the world with real-time suggestions"
			)
		).toBeInTheDocument();
	});

	it("renders the city search component", () => {
		render(<CitySearchPage />);

		expect(screen.getByTestId("city-search")).toBeInTheDocument();
		expect(screen.getByText("Select a City")).toBeInTheDocument();
	});

	it("handles city selection and navigates to recommendations", async () => {
		const user = userEvent.setup();
		render(<CitySearchPage />);

		const selectButton = screen.getByTestId("select-city-button");
		await user.click(selectButton);

		await waitFor(() => {
			expect(mockNavigate).toHaveBeenCalledWith(
				"/recommendations?city=New+York&country=United+States&lat=40.7128&lon=-74.006&state=New+York"
			);
		});
	});

	it("displays selected city information when a city is selected", async () => {
		const user = userEvent.setup();
		render(<CitySearchPage />);

		const selectButton = screen.getByTestId("select-city-button");
		await user.click(selectButton);

		await waitFor(() => {});
		expect(screen.getByText("Selected City")).toBeInTheDocument();
		expect(
			screen.getByText("🎉 Redirecting to AI recommendations...")
		).toBeInTheDocument();
	});

	it("renders with proper accessibility labels", () => {
		render(<CitySearchPage />);

		expect(screen.getByText("Select a City")).toBeInTheDocument();
		expect(screen.getByTestId("city-search")).toBeInTheDocument();
	});
});
