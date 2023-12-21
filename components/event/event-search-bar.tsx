'use client';

import { useRef } from 'react';
import { LuSearch } from 'react-icons/lu';
import { Button, Input } from '../ui';

export interface EventSearchBarProps {
  onSearch?: Function;
}

export function EventSearchBar({ onSearch }: EventSearchBarProps) {
  const inputRef = useRef<any>();

  return (
    <div className="flex items-center bg-white py-2 px-[15px] gap-[15px] rounded-m shadow-m">
      <LuSearch className="text-primary text-2xl mx-[15px]" />
      <Input
        ref={inputRef}
        type="text"
        placeholder="TÌm những sự kiện mà bạn hứng thú"
        className="border-none rounded-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      <Button
        type="button"
        className="text-white w-[124px]"
        onClick={() => onSearch && onSearch(inputRef.current.value)}
      >
        Tìm kiếm
      </Button>
    </div>
  );
}
