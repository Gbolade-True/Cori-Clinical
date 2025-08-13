import { Button } from "@/components/ui/button";

type Category = {
	id: string;
	name: string;
	icon: string;
};

interface CategoryFilterProps {
	categories: Category[];
	selectedCategory: string;
	onCategoryChange: (categoryId: string) => void;
	title?: string;
	className?: string;
}

const CategoryFilter = ({
	categories,
	selectedCategory,
	onCategoryChange,
	title = "Filter by Category",
	className = "",
}: CategoryFilterProps) => {
	return (
		<div className={`mb-6 ${className}`}>
			<div className="rounded-lg p-4 shadow-lg">
				<h2 className="text-lg font-semibold mb-3">{title}</h2>
				<div className="flex flex-wrap gap-2">
					{categories.map((category) => (
						<Button
							key={category.id}
							variant={
								selectedCategory === category.id
									? "outline"
									: "default"
							}
							onClick={() => onCategoryChange(category.id)}
							className="flex items-center gap-2"
						>
							<span>{category.icon}</span>
							{category.name}
						</Button>
					))}
				</div>
			</div>
		</div>
	);
};

export default CategoryFilter;
