import { Loader2 } from "lucide-react";

interface LoadingStateProps {
	title?: string;
	description?: string;
	className?: string;
}

const LoadingState = ({
	title = "Loading...",
	description,
	className = "",
}: LoadingStateProps) => {
	return (
		<div className={`rounded-lg p-12 shadow-lg text-center ${className}`}>
			<Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
			<h2 className="text-xl font-semibold mb-2">{title}</h2>
			{description && <p>{description}</p>}
		</div>
	);
};

export default LoadingState;
