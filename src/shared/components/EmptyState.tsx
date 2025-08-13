import { Search } from "lucide-react";

interface EmptyStateProps {
	title?: string;
	description?: string;
	icon?: React.ReactNode;
	className?: string;
}

const EmptyState = ({
	title = "No results found",
	description,
	icon,
	className = "",
}: EmptyStateProps) => {
	return (
		<div className={`rounded-lg p-12 shadow-lg text-center ${className}`}>
			{icon || (
				<Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
			)}
			<h2 className="text-xl font-semibold mb-2">{title}</h2>
			{description && <p>{description}</p>}
		</div>
	);
};

export default EmptyState;
