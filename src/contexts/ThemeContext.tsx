import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
	theme: Theme;
	setTheme: (theme: Theme) => void;
	resolvedTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
	children: React.ReactNode;
	defaultTheme?: Theme;
	storageKey?: string;
}

export function ThemeProvider({
	children,
	defaultTheme = "system",
	storageKey = "cori-theme",
}: ThemeProviderProps) {
	const [theme, setTheme] = useState<Theme>(() => {
		// Try to get theme from localStorage
		const stored = localStorage.getItem(storageKey);
		if (
			stored &&
			(stored === "light" || stored === "dark" || stored === "system")
		) {
			return stored;
		}
		return defaultTheme;
	});

	const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">(() => {
		if (theme === "system") {
			return window.matchMedia("(prefers-color-scheme: dark)").matches
				? "dark"
				: "light";
		}
		return theme;
	});

	useEffect(() => {
		// Save theme to localStorage
		localStorage.setItem(storageKey, theme);

		// Update resolved theme
		if (theme === "system") {
			const mediaQuery = window.matchMedia(
				"(prefers-color-scheme: dark)"
			);
			setResolvedTheme(mediaQuery.matches ? "dark" : "light");

			// Listen for system theme changes
			const handleChange = (e: MediaQueryListEvent) => {
				setResolvedTheme(e.matches ? "dark" : "light");
			};

			mediaQuery.addEventListener("change", handleChange);
			return () => mediaQuery.removeEventListener("change", handleChange);
		} else {
			setResolvedTheme(theme);
		}
	}, [theme, storageKey]);

	useEffect(() => {
		// Apply theme to document with proper class management
		const root = window.document.documentElement;

		// Remove existing theme classes
		root.classList.remove("light", "dark");

		// Add the appropriate theme class
		if (resolvedTheme === "dark") {
			root.classList.add("dark");
		} else {
			root.classList.add("light");
		}

		// Update data attribute for additional styling hooks
		root.setAttribute("data-theme", resolvedTheme);

		// Update color scheme meta tag
		const colorSchemeMeta = document.querySelector(
			'meta[name="color-scheme"]'
		);
		if (colorSchemeMeta) {
			colorSchemeMeta.setAttribute("content", resolvedTheme);
		} else {
			const meta = document.createElement("meta");
			meta.name = "color-scheme";
			meta.content = resolvedTheme;
			document.head.appendChild(meta);
		}
	}, [resolvedTheme]);

	const value = {
		theme,
		setTheme,
		resolvedTheme,
	};

	return (
		<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
	);
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
}
