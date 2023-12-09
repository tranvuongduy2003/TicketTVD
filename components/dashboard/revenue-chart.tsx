'use client';

import { Revenue } from '@/models';
import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import {
  NameType,
  ValueType
} from 'recharts/types/component/DefaultTooltipContent';
import { ContentType } from 'recharts/types/component/Tooltip';

export interface RevenueChartProps {
  revenue: Revenue[];
}

const longMonths = [
  'Th 1',
  'Th 2',
  'Th 3',
  'Th 4',
  'Th 5',
  'Th 6',
  'Th 7',
  'Th 8',
  'Th 9',
  'Th 10',
  'Th 11',
  'Th 12'
];

export function RevenueChart({ revenue }: RevenueChartProps) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart
        data={revenue}
        margin={{
          top: 35,
          left: 30,
          right: 30,
          bottom: 10
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          stroke="#888888"
          fontSize={12}
          tickFormatter={value => longMonths[value - 1]}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          unit={' VNĐ'}
          tickFormatter={value => value.toLocaleString()}
        />
        <Tooltip content={CustomTooltip} />
        <Bar dataKey="value" fill="#f26298" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

const CustomTooltip: ContentType<ValueType, NameType> = ({
  active,
  payload,
  label
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip bg-primary-100 p-4 rounded-m text-neutral-500 text-sm">
        <p className="label">
          <span className="font-bold">{`Doanh số tháng ${label} : `}</span>
          <span>{`${payload[0].value?.toLocaleString()} VNĐ`}</span>
        </p>
      </div>
    );
  }

  return null;
};
