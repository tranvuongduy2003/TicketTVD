'use client';

import { EventStatistic } from '@/models';
import { useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Sector } from 'recharts';
import { PieSectorDataItem } from 'recharts/types/polar/Pie';
import { ActiveShape } from 'recharts/types/util/types';

export interface EventsByCategoryChartProps {
  eventsByCategory: EventStatistic[];
}

const renderActiveShape: ActiveShape<PieSectorDataItem> = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  startAngle,
  endAngle,
  fill,
  percent,
  value,
  name
}: PieSectorDataItem) => {
  const RADIAN = Math.PI / 180;
  const sin = Math.sin(-RADIAN * (midAngle || 0));
  const cos = Math.cos(-RADIAN * (midAngle || 0));
  const sx = (cx || 0) + ((outerRadius || 0) + 10) * cos;
  const sy = (cy || 0) + ((outerRadius || 0) + 10) * sin;
  const mx = (cx || 0) + ((outerRadius || 0) + 30) * cos;
  const my = (cy || 0) + ((outerRadius || 0) + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={(outerRadius || 0) + 6}
        outerRadius={(outerRadius || 0) + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill={fill}
        className="font-semibold"
      >
        {`${name}`}
      </text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#333"
      >
        {`${value} sự kiện`}
      </text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={36}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(${((percent || 0) * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

export function EventsByCategoryChart({
  eventsByCategory
}: EventsByCategoryChartProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  return (
    <ResponsiveContainer width="100%" height={320}>
      <PieChart
        margin={{
          bottom: 10
        }}
      >
        <Pie
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          data={eventsByCategory}
          outerRadius={90}
          fill="#f26298"
          dataKey="eventQuantity"
          onMouseEnter={(_, index) => setActiveIndex(index)}
        >
          {eventsByCategory.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.category.color}
              name={entry.category.name}
            />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
