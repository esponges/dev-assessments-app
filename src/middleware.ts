import { authMiddleware } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export default authMiddleware({
  // Routes that can be accessed while signed out
  publicRoutes: ['/', '/api/webhooks(.*)'],
  // Routes that can always be accessed, and have
  // no authentication information
  ignoredRoutes: ['/no-auth-in-this-route'],
  afterAuth: (auth, req, _evt) => {
    const homeUrl = new URL('/', req.url);

    // take to user to landing page after logout
    if (!auth.userId && !auth.isPublicRoute) {
      return NextResponse.redirect(homeUrl);
    }
  },
});

export const config = {
  // Protects all routes, including api/trpc.
  // See https://clerk.com/docs/references/nextjs/auth-middleware
  // for more information about configuring your Middleware
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
