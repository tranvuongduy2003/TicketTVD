import { cn } from '@/types';
import { ReactNode, useState } from 'react';
import { LuChevronDown } from 'react-icons/lu';
import { Button, Checkbox, Separator } from '../ui';
import { Category } from '@/models';

export interface FilterBarProps {
  categories: Category[];
}

export interface FilterSectionProps {
  title: ReactNode;
  children?: ReactNode;
}

export function FilterBar({ categories }: FilterBarProps) {
  return (
    <div className="w-[276px] bg-neutral-100 rounded-m">
      <h5 className="text-xl font-bold p-4 border-b-2 border-solid border-neutral-300">
        Bộ lọc tìm kiếm
      </h5>
      <div className="p-4">
        <FilterSection title={'Thể loại'}>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Checkbox id="all" /> <label htmlFor="all">Tất cả</label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="all" /> <label htmlFor="all">Nổi bật</label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="all" /> <label htmlFor="all">Sắp diễn ra</label>
            </div>
            {categories.map(category => (
              <div key={category.id} className="flex items-center gap-2">
                <Checkbox id={category.id.toString()} />{' '}
                <label htmlFor={category.id.toString()}>{category.name}</label>
              </div>
            ))}
          </div>
        </FilterSection>
        <Separator className="my-4" />
        <FilterSection title="Giá">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Checkbox id="free" /> <label htmlFor="free">Miễn phí</label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="paid" /> <label htmlFor="paid">Trả phí</label>
            </div>
          </div>
        </FilterSection>
        <Separator className="my-4" />
        <div className="flex items-center justify-between gap-2">
          <Button
            variant={'ghost'}
            type="reset"
            className="text-primary-500 w-full"
          >
            Xóa tất cả
          </Button>
          <Button type="button" className="text-white w-full">
            Áp dụng
          </Button>
        </div>
      </div>
    </div>
  );
}

export function FilterSection({ title, children }: FilterSectionProps) {
  const [isHidden, setIsHidden] = useState<boolean>(false);

  return (
    <div>
      <div
        className="text-[15px] font-bold leading-6 flex items-center justify-between w-full cursor-pointer mb-2"
        onClick={() => setIsHidden(!isHidden)}
      >
        <div>{title}</div>
        <LuChevronDown />
      </div>
      <div
        className={cn(
          'transition-all pr-[15px]',
          isHidden ? 'opacity-0 invisible h-0' : 'opacity-100 visible h-auto'
        )}
      >
        {children}
      </div>
    </div>
  );
}
