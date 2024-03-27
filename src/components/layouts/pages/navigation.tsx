'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
import { useUserDetails } from '@/lib/hooks';

const links = [
  { href: '/assess-profile', title: 'Upload CV' },
  {
    href: '/evaluate',
    title: 'Get evaluated',
  },
  { href: '/challenge', title: 'Code challenge' },
  { href: '/devs/search', title: 'Get Developer Profiles' },
];

function AuthHeader({ isSignedIn }: { isSignedIn?: boolean }) {
  const router = useRouter();

  const handleLogout = () => {
    router.push('/');
  };

  return (
    <header className="flex items-center justify-end space-x-4">
      <DropdownMenu>
        {!isSignedIn ? (
          <SignedOut>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <SignInButton redirectUrl="/account" />
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
                <SignOutButton signOutCallback={handleLogout} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </>
        )}
      </DropdownMenu>
    </header>
  );
}

function NavigationLinks() {
  return (
    <>
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
    </>
  );
}

export function Navigation({ children }: { children: React.ReactNode }) {
  const { user } = useUserDetails();

  return (
    <>
      <NavigationMenu className="mx-auto">
        <NavigationMenuList>
          {!!user ? (
            <NavigationLinks />
          ) : (
            <Link
              href="/"
              passHref
              legacyBehavior
            >
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Dev Hunter
              </NavigationMenuLink>
            </Link>
          )}
        </NavigationMenuList>
        <NavigationMenuIndicator />
        <NavigationMenuViewport />
        <AuthHeader isSignedIn={!!user} />
      </NavigationMenu>
      {children}
    </>
  );
}
