import * as React from 'react'
import { cn } from '@/lib/utils'

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {}
export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Avatar.displayName = 'Avatar'

export interface AvatarFallbackProps extends React.HTMLAttributes<HTMLSpanElement> {}
export const AvatarFallback = ({ className, children, ...props }: AvatarFallbackProps) => (
  <span className={cn('text-sm font-medium text-muted-foreground', className)} {...props}>
    {children}
  </span>
)
