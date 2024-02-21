import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { Inter as FontSans } from 'next/font/google';

export const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

const links = [
  { href: '/assess-profile', label: 'Assess Dev Profile' },
  { href: '/evaluate', label: 'Evaluate Developer' },
  { href: '/get-profiles', label: 'Get Developer Profiles' },
];

export function PagesNavigation({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        'min-h-screen bg-background font-sans antialiased',
        fontSans.variable
      )}
    >
      <NavigationMenu>
        <NavigationMenuList>
          {links.map((link, index) => (
            <NavigationMenuItem key={index}>
              <NavigationMenuTrigger>{link.label}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuLink href={link.href}>
                  {link.label}
                </NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
        <NavigationMenuIndicator />
        <NavigationMenuViewport />
      </NavigationMenu>
      {children}
    </div>
  );
}
