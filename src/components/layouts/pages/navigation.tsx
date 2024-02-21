import {
  NavigationMenu,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import Link from 'next/link';

const links = [
  { href: 'app/assess-profile', title: 'Assess Dev Profile' },
  { href: 'app/evaluate', title: 'Evaluate Developer' },
  { href: 'app/get-profiles', title: 'Get Developer Profiles' },
];

export function Navigation({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavigationMenu className='mx-auto'>
        <NavigationMenuList>
          {links.map((link, index) => (
            <NavigationMenuItem key={index}>
              <Link href={link.href} legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  {link.title}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
        <NavigationMenuIndicator />
        <NavigationMenuViewport />
      </NavigationMenu>
      {children}
    </>
  );
}
