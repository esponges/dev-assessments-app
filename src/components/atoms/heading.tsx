import { cn } from '@/lib/utils';

type Props = {
  className?: string;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children?: React.ReactNode;
};

export function Heading({ className, variant = 'h1', children }: Props) {
  switch (variant) {
    case 'h1':
      return (
        <h1 className={cn('text-2xl font-bold my-4', className)}>{children}</h1>
      );
    case 'h2':
      return (
        <h2 className={cn('text-xl font-bold my-4', className)}>{children}</h2>
      );
    case 'h3':
      return (
        <h3 className={cn('text-lg font-bold my-4', className)}>{children}</h3>
      );
    case 'h4':
      return (
        <h4 className={cn('text-base font-bold my-4', className)}>
          {children}
        </h4>
      );
    case 'h5':
      return (
        <h5 className={cn('text-sm font-bold my-4', className)}>{children}</h5>
      );
    case 'h6':
      return (
        <h6 className={cn('text-xs font-bold my-4', className)}>{children}</h6>
      );
    default:
      return (
        <h1 className={cn('text-2xl font-bold my-4', className)}>{children}</h1>
      );
  }
}
