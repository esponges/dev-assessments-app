import { cn } from '@/lib/utils';

export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main
      className={cn(
        'flex min-h-screen flex-col items-center py-12 mx-auto',
        className
      )}
    >
      {children}
    </main>
  );
}
