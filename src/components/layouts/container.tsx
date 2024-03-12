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
        'flex min-h-screen flex-col items-center py-12 mx-auto md:px-4 px-2 w-full md:max-w-15xl',
        className
      )}
    >
      {children}
    </main>
  );
}
