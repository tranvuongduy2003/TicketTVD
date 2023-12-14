'use client';

import { ReactElement, ReactNode } from 'react';

interface DetailItemProps {
  icon: ReactElement;
  title: ReactNode;
  description: ReactNode;
}

export function DetailItem({ icon, title, description }: DetailItemProps) {
  return (
    <div className="flex items-center gap-6">
      <div className="text-primary-500 text-[32px] p-6 rounded-m bg-primary-100">
        {icon}
      </div>
      <div className="flex flex-col justify-between">
        <h4 className="uppercase font-bold leading-[26px]">{title}</h4>
        <div className="text-neutral-550 leading-[26px]">{description}</div>
      </div>
    </div>
  );
}
