import { ReactNode } from 'react';
import {
  LuBike,
  LuBuilding,
  LuCamera,
  LuMusic,
  LuPalette
} from 'react-icons/lu';

export const categoryIcons = new Map<number, ReactNode>([
  [1, <LuMusic key={1} />],
  [2, <LuBike key={2} />],
  [3, <LuPalette key={3} />],
  [4, <LuBuilding key={4} />],
  [5, <LuCamera key={5} />]
]);
