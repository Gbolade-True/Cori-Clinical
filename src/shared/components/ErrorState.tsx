import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
	title?: string;
	message?: string;
	onRetry?: () => void;
	retryText?: string;
	className?: string;
}

const ErrorState = ({
	title = "Error",
	message,
	onRetry,
	retryText = "Try Again",
	className = "",
}: ErrorStateProps) => {
	return (
		<div className={`rounded-lg p-8 shadow-lg text-center ${className}`}>
			<AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
			<h2 className="text-xl font-semibold text-red-900 mb-2">{title}</h2>
			{message && <p className="text-red-500 mb-4">{message}</p>}
			{onRetry && (
				<Button
					onClick={onRetry}
					variant="outline"
					className="border-red-300 text-red-500 hover:bg-red-100"
				>
					{retryText}
				</Button>
			)}
		</div>
	);
};

export default ErrorState;
