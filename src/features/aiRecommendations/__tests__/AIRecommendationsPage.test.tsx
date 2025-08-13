/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "@/test/utils";
import AIRecommendationsPage from "../AIRecommendationsPage";
import { mockCity, mockRecommendations } from "@/test/testData";
import type { Recommendation } from "@/shared/interfaces/recommendation";

// Mock the hooks and components
const mockUseAIRecommendations = vi.fn();
vi.mock("@/api/useAIRecommendations", () => ({
	useAIRecommendations: () => mockUseAIRecommendations(),
}));

const mockUseSearchParams = vi.fn();
const mockUseNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
	const actual = await vi.importActual("react-router-dom");
	return {
		...actual,
		useSearchParams: () => mockUseSearchParams(),
		useNavigate: () => mockUseNavigate(),
	};
});

// Mock child components
vi.mock("../RecommendationsGrid", () => ({
	default: ({ recommendations }: { recommendations: Recommendation[] }) => (
		<div data-testid="recommendations-grid">
			{recommendations.map((rec: Recommendation, index: number) => (
				<div key={index} data-testid={`recommendation-${index}`}>
					{rec.name}
				</div>
			))}
		</div>
	),
}));

vi.mock("../CategoryFilter", () => ({
	default: ({ categories, selectedCategory, onCategoryChange }: any) => (
		<div data-testid="category-filter">
			{categories.map((cat: any) => (
				<button
					key={cat.id}
					onClick={() => onCategoryChange(cat.id)}
					data-testid={`category-${cat.id}`}
					className={selectedCategory === cat.id ? "selected" : ""}
				>
					{cat.name}
				</button>
			))}
		</div>
	),
}));

describe("AIRecommendationsPage", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUseNavigate.mockReturnValue(vi.fn());
	});

	describe("with city from props", () => {
		beforeEach(() => {
			mockUseSearchParams.mockReturnValue([new URLSearchParams()]);
			mockUseAIRecommendations.mockReturnValue({
				recommendations: mockRecommendations,
				isPending: false,
				error: null,
				refetch: vi.fn(),
			});
		});

		it("renders with city from props", () => {
			render(<AIRecommendationsPage city={mockCity} />);

			expect(
				screen.getByText("AI Recommendations for New York")
			).toBeInTheDocument();
			expect(
				screen.getByText(
					"Discover the best places to visit in New York, United States"
				)
			).toBeInTheDocument();
		});

		it("renders category filter", () => {
			render(<AIRecommendationsPage city={mockCity} />);

			expect(screen.getByTestId("category-filter")).toBeInTheDocument();
			expect(screen.getByTestId("category-activity")).toBeInTheDocument();
			expect(
				screen.getByTestId("category-entertainment")
			).toBeInTheDocument();
		});

		it("renders recommendations grid", () => {
			render(<AIRecommendationsPage city={mockCity} />);

			expect(
				screen.getByTestId("recommendations-grid")
			).toBeInTheDocument();
			expect(screen.getByTestId("recommendation-0")).toBeInTheDocument();
			expect(screen.getByTestId("recommendation-1")).toBeInTheDocument();
			expect(screen.getByText("Central Park")).toBeInTheDocument();
			expect(screen.getByText("Broadway Show")).toBeInTheDocument();
		});

		it("handles category change", async () => {
			const user = userEvent.setup();
			render(<AIRecommendationsPage city={mockCity} />);

			const entertainmentButton = screen.getByTestId(
				"category-entertainment"
			);
			await user.click(entertainmentButton);

			expect(entertainmentButton).toHaveClass("selected");
		});

		it("handles back navigation", async () => {
			const mockNavigate = vi.fn();
			mockUseNavigate.mockReturnValue(mockNavigate);
			const user = userEvent.setup();

			render(<AIRecommendationsPage city={mockCity} />);

			const backButton = screen.getByText("Back to City Search");
			await user.click(backButton);

			expect(mockNavigate).toHaveBeenCalledWith("/");
		});
	});

	describe("with city from URL params", () => {
		beforeEach(() => {
			const searchParams = new URLSearchParams({
				city: "London",
				country: "United Kingdom",
				lat: "51.5074",
				lon: "-0.1278",
			});
			mockUseSearchParams.mockReturnValue([searchParams]);
			mockUseAIRecommendations.mockReturnValue({
				recommendations: mockRecommendations,
				isPending: false,
				error: null,
				refetch: vi.fn(),
			});
		});

		it("renders with city from URL params", () => {
			render(<AIRecommendationsPage />);

			expect(
				screen.getByText("AI Recommendations for London")
			).toBeInTheDocument();
			expect(
				screen.getByText(
					"Discover the best places to visit in London, United Kingdom"
				)
			).toBeInTheDocument();
		});
	});

	describe("loading state", () => {
		beforeEach(() => {
			mockUseSearchParams.mockReturnValue([new URLSearchParams()]);
			mockUseAIRecommendations.mockReturnValue({
				recommendations: [],
				isPending: true,
				error: null,
				refetch: vi.fn(),
			});
		});

		it("shows loading state", () => {
			render(<AIRecommendationsPage city={mockCity} />);

			expect(
				screen.getByText("Getting AI Recommendations...")
			).toBeInTheDocument();
			expect(
				screen.getByText(
					"Our AI is analyzing New York to find the best places for you"
				)
			).toBeInTheDocument();
		});
	});

	describe("error state", () => {
		beforeEach(() => {
			mockUseSearchParams.mockReturnValue([new URLSearchParams()]);
			mockUseAIRecommendations.mockReturnValue({
				recommendations: [],
				isPending: false,
				error: { message: "Failed to fetch recommendations" },
				refetch: vi.fn(),
			});
		});

		it("shows error state", () => {
			render(<AIRecommendationsPage city={mockCity} />);

			expect(
				screen.getByText("Failed to fetch recommendations")
			).toBeInTheDocument();
		});
	});

	describe("empty state", () => {
		beforeEach(() => {
			mockUseSearchParams.mockReturnValue([new URLSearchParams()]);
			mockUseAIRecommendations.mockReturnValue({
				recommendations: [],
				isPending: false,
				error: null,
				refetch: vi.fn(),
			});
		});

		it("shows empty state when no recommendations", () => {
			render(<AIRecommendationsPage city={mockCity} />);

			expect(
				screen.getByText("No recommendations found")
			).toBeInTheDocument();
			expect(
				screen.getByText(
					"Try selecting a different category or check back later for more recommendations."
				)
			).toBeInTheDocument();
		});
	});

	describe("no city selected", () => {
		beforeEach(() => {
			mockUseSearchParams.mockReturnValue([new URLSearchParams()]);
		});

		it("shows no city selected message", () => {
			render(<AIRecommendationsPage />);

			expect(screen.getByText("No City Selected")).toBeInTheDocument();
			expect(
				screen.getByText(
					"Please select a city to get AI recommendations."
				)
			).toBeInTheDocument();
		});

		it("provides back button when no city selected", async () => {
			const mockNavigate = vi.fn();
			mockUseNavigate.mockReturnValue(mockNavigate);
			const user = userEvent.setup();

			render(<AIRecommendationsPage />);

			const backButton = screen.getByText("Back to City Search");
			await user.click(backButton);

			expect(mockNavigate).toHaveBeenCalledWith("/");
		});
	});
});
