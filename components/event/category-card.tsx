import { categoryIcons } from '@/constants';
import { Category } from '@/models';

export interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <div className="flex flex-col items-center gap-[10px] w-[211px] h-[154px] justify-center rounded-m bg-neutral-100 curs">
      <div className="text-[40px] text-primary-500">
        {categoryIcons.get(category.id)}
      </div>
      <h3>{category.name}</h3>
    </div>
  );
}
