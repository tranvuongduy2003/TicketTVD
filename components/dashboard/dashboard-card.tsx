'use client';

import { ReactElement, ReactNode } from 'react';

export interface DashboardCardProps {
  borderColor: string;
  bgColor: string;
  primaryColor: string;
  content: ReactNode;
  icon: ReactElement;
  title: string;
}

export function DashboardCard({
  primaryColor,
  borderColor,
  bgColor,
  content,
  icon,
  title
}: DashboardCardProps) {
  return (
    <div
      className="w-full py-[18px] rounded-m border border-solid border-opacity-40 bg-opacity-20 flex flex-col items-center"
      style={{
        backgroundColor: bgColor,
        borderColor: borderColor
      }}
    >
      <div
        className="h-9 w-9 rounded-full p-2 text-white flex justify-center items-center"
        style={{
          backgroundColor: primaryColor
        }}
      >
        {icon}
      </div>
      <p
        className="text-[32px] font-semibold leading-[48px] text-center"
        style={{
          color: primaryColor
        }}
      >
        {content}
      </p>
      <h5 className="text-center font-bold text-neutral-700">{title}</h5>
    </div>
  );
}
