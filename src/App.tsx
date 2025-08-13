import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AppLayout } from "@/components/layout/AppLayout";
import CitySearchPage from "@/features/citySearch/CitySearchPage";
import AIRecommendationsPage from "@/features/aiRecommendations/AIRecommendationsPage";

function App() {
	return (
		<ThemeProvider defaultTheme="system" storageKey="cori-clinical-theme">
			<Router>
				<AppLayout>
					<Routes>
						<Route path="/" element={<CitySearchPage />} />
						<Route
							path="/recommendations"
							element={<AIRecommendationsPage />}
						/>
					</Routes>
				</AppLayout>
			</Router>
		</ThemeProvider>
	);
}

export default App;
