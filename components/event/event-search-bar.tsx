import * as React from 'react';
import { Button, Input } from '../ui';
import { LuSearch } from 'react-icons/lu';
import { useRouter } from 'next/router';

export interface EventSearchBarProps {}

export function EventSearchBar(props: EventSearchBarProps) {
  const router = useRouter();

  return (
    <div className="flex items-center bg-white py-2 px-[15px] gap-[15px] rounded-m shadow-m">
      <LuSearch className="text-primary text-2xl mx-[15px]" />
      <Input
        type="text"
        placeholder="TÌm những sự kiện mà bạn hứng thú"
        className="border-none rounded-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      <Button
        type="button"
        className="text-white w-[124px]"
        onClick={() => router.push('/event/search')}
      >
        Tìm kiếm
      </Button>
    </div>
  );
}
