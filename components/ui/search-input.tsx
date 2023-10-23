import * as React from 'react';

import { cn } from '@/utils';
import { LuSearch } from 'react-icons/lu';

export interface SearchInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <div className="flex items-center h-10">
        <input
          type={type}
          className={cn(
            'flex h-full w-full rounded-l-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          ref={ref}
          {...props}
        />
        <button className="h-full px-4 bg-primary-500 rounded-r-md">
          <LuSearch className="text-base text-white" />
        </button>
      </div>
    );
  }
);
SearchInput.displayName = 'SearchInput';

export { SearchInput };
