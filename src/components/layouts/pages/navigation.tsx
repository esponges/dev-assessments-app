'use client';

import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  SignOutButton,
} from '@clerk/nextjs';
import { UseUserDetails } from '@/lib/hooks';

const links = [
  { href: '/assess-profile', title: 'Assess Dev Profile' },
  {
    href: '/evaluate',
    title: 'Evaluate Developer',
  },
  { href: '/challenge', title: 'Code Challenge' },
  { href: '/devs/search', title: 'Get Developer Profiles' },
];

function AuthHeader() {
  const { user } = UseUserDetails();

  return (
    <header className="flex items-center justify-end space-x-4">
      <DropdownMenu>
        {!user ? (
          <SignedOut>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <SignInButton />
            </NavigationMenuLink>
          </SignedOut>
        ) : (
          <>
            <DropdownMenuTrigger>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <Link
                href="/account"
                passHref
              >
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <SignOutButton />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </>
        )}
      </DropdownMenu>
    </header>
  );
}

export function Navigation({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavigationMenu className="mx-auto">
        <NavigationMenuList>
          {links.map((link, index) => (
            <NavigationMenuItem key={index}>
              <Link
                href={link.href}
                legacyBehavior
                passHref
              >
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  {link.title}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
        <NavigationMenuIndicator />
        <NavigationMenuViewport />
        <AuthHeader />
      </NavigationMenu>
      {children}
    </>
  );
}
