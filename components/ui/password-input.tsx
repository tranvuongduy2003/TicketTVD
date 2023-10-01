import React, { useState } from 'react';

import { cn } from '@/utils';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    return (
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          className={cn(
            'pl-3 pr-10 flex h-10 w-full rounded-md border border-input bg-background py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          ref={ref}
          {...props}
        />
        <span
          className="absolute top-1/2 -translate-y-1/2 right-0 w-10 flex justify-center text-lg"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
        </span>
      </div>
    );
  }
);
PasswordInput.displayName = 'PasswordInput';

export { PasswordInput };
