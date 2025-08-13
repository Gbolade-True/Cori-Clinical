import { type PropsWithChildren } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { getColor } from "@/shared/helpers";

export function AppLayout({ children }: PropsWithChildren) {
	const { resolvedTheme } = useTheme();

	return (
		<div className={cn("min-h-screen", getColor("bg-bg-1"))}>
			{/* Header with theme toggle */}
			<header className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
				<div className="container mx-auto px-4 py-4 flex items-center justify-between">
					<div className="flex items-center space-x-2">
						<h1 className="text-xl font-bold bg-clip-text">
							Cori Clinical
						</h1>
					</div>

					<div className="flex items-center space-x-4">
						{/* Theme toggle */}
						<ThemeToggle />

						{/* Theme indicator */}
						<div className="hidden sm:flex items-center space-x-2 text-sm text-muted-foreground">
							<span>Theme:</span>
							<span className="font-medium">
								{resolvedTheme === "dark" ? "��" : "☀️"}{" "}
								{resolvedTheme}
							</span>
						</div>
					</div>
				</div>
			</header>

			{/* Main content */}
			<main className="container mx-auto px-4 py-8">{children}</main>

			{/* Footer */}
			<footer className="border-t border-border bg-card/50 mt-auto">
				<div className="container mx-auto px-4 py-6">
					<p className="text-center text-sm text-muted-foreground">
						© 2024 Cori Clinical. Built with React, TypeScript, and
						Tailwind CSS.
					</p>
				</div>
			</footer>
		</div>
	);
}
