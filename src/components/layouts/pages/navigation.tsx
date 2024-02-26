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
  { href: 'assess-profile', title: 'Assess Dev Profile' },
  // todo: remove this test query
  { href: 'evaluate?id=9fe4c751-3a92-406b-8c2a-5d38e6981415', title: 'Evaluate Developer' },
  { href: 'get-profiles', title: 'Get Developer Profiles' },
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
