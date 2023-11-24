import { cn } from '@/utils';
import React, { ReactElement, ReactNode, useState } from 'react';
import { LuChevronDown } from 'react-icons/lu';

interface CreateEventSectionProps {
  icon: ReactElement;
  title: string;
  children: ReactNode;
}

export function CreateEventSection({
  icon,
  title,
  children
}: CreateEventSectionProps) {
  const [isShow, setIsShow] = useState<boolean>(true);

  return (
    <div>
      <div
        className="text-2xl font-bold flex justify-between items-center cursor-pointer"
        onClick={() => setIsShow(!isShow)}
      >
        <div className="flex items-center gap-4">
          <div className="text-primary-500">{icon}</div>
          <h5>{title}</h5>
        </div>
        <LuChevronDown
          className={cn('transition-all', !isShow && 'rotate-180')}
        />
      </div>
      <div
        className={cn(
          'transition-all',
          isShow ? 'opacity-100 visible h-auto' : 'opacity-0 invisible h-0'
        )}
      >
        {children}
      </div>
    </div>
  );
}
