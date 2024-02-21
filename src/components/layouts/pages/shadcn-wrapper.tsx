import { cn } from '@/lib/utils';
import { Inter as FontSans } from 'next/font/google';

export const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

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
