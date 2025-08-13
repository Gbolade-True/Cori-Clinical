/* eslint-disable react-refresh/only-export-components */
import { render, type RenderOptions } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import type { ReactElement } from "react";

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
	return (
		<BrowserRouter>
			<ThemeProvider>{children}</ThemeProvider>
		</BrowserRouter>
	);
};

const customRender = (
	ui: ReactElement,
	options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

export { customRender as render };
