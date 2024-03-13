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
import { useQuery } from '@tanstack/react-query';

const links = [
  { href: '/assess-profile', title: 'Assess Dev Profile' },
  {
    href: '/evaluate',
    title: 'Evaluate Developer',
  },
  { href: '/challenge', title: 'Code Challenge' },
  { href: '/devs/search', title: 'Get Developer Profiles' },
];

const getDevDetails = async (id: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/candidate/details?id=${id}`
  );

  if (!res.ok) {
    throw new Error('Network response was not ok');
  }

  const json = await res.json();

  return json;
};

function AuthHeader() {
  const { user } = useUser();

  // make user info available to the rest of the app
  useQuery({
    queryKey: ['user', user?.id],
    queryFn: () => getDevDetails(user?.id || ''),
    enabled: !!user?.id,
  });

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
