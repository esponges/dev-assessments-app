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
  useUser,
  SignOutButton,
} from '@clerk/nextjs';

const links = [
  { href: '/assess-profile', title: 'Assess Dev Profile' },
  {
    href: '/evaluate?id=d1d5bd58-f1a6-44bb-a8d3-835fea4880c0',
    title: 'Evaluate Developer',
  },
  { href: '/challenge', title: 'Code Challenge' },
  { href: '/devs/search', title: 'Get Developer Profiles' },
];

function AuthHeader() {
  const { user } = useUser();

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
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
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
