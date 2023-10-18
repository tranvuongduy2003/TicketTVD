import {
  LuActivity,
  LuArrowDown,
  LuArrowRight,
  LuArrowUp
} from 'react-icons/lu';

export const labels = [
  {
    value: 'bug',
    label: 'Bug'
  },
  {
    value: 'feature',
    label: 'Feature'
  },
  {
    value: 'documentation',
    label: 'Documentation'
  }
];

export const statuses = [
  {
    value: 'backlog',
    label: 'Backlog',
    icon: LuActivity
  },
  {
    value: 'todo',
    label: 'Todo',
    icon: LuActivity
  },
  {
    value: 'in progress',
    label: 'In Progress',
    icon: LuActivity
  },
  {
    value: 'done',
    label: 'Done',
    icon: LuActivity
  },
  {
    value: 'canceled',
    label: 'Canceled',
    icon: LuActivity
  }
];

export const priorities = [
  {
    label: 'Low',
    value: 'low',
    icon: LuArrowDown
  },
  {
    label: 'Medium',
    value: 'medium',
    icon: LuArrowRight
  },
  {
    label: 'High',
    value: 'high',
    icon: LuArrowUp
  }
];
