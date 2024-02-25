import { cn } from '@/lib/utils';
import { Inter as FontSans } from 'next/font/google';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

// wraps shadcn to a pages router app
export function ShadcnWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        'min-h-screen bg-background font-sans antialiased',
        fontSans.variable
      )}
    >
      {children}
    </div>
  );
}
