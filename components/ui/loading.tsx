import { cn } from '@/utils';

interface LoadingProps {
  size?: 'small' | 'large';
}

export function Loading({ size = 'small' }: LoadingProps) {
  return (
    <div
      className={cn(
        'mx-auto my-8 w-8 h-8 rounded-full border-4 border-t-transparent animate-spin',
        size === 'large' && 'w-16 h-16'
      )}
    ></div>
  );
}
