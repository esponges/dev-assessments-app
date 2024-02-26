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
  { href: 'evaluate?id=4a1dbe64-a771-4b94-9a02-b5c96bfe4354', title: 'Evaluate Developer' },
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
