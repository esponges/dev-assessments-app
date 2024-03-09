"use client";

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
  { href: 'evaluate?id=d1d5bd58-f1a6-44bb-a8d3-835fea4880c0', title: 'Evaluate Developer' },
  { href: 'challenge', title: 'Code Challenge' },
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
