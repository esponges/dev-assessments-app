import { authMiddleware } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export default authMiddleware({
  // Routes that can be accessed while signed out
  publicRoutes: ['/'],
  // Routes that can always be accessed, and have
  // no authentication information
  ignoredRoutes: ['/no-auth-in-this-route'],
  afterAuth: (auth, req, _evt) => {
    const homeUrl = new URL('/', req.url);

    // take to user to landing page after logout
    if (!auth.userId && !auth.isPublicRoute) {
      return NextResponse.redirect(homeUrl);
    }

    // this doesn't work - user always comes undefined even if logged in
    // probably use webhooks to update the user's session in the db?
    // update the user's session in the db
    if (auth.user) {
      let body;

      // if createdAt is equal to updatedAt, then the user is new
      if (auth.user?.createdAt === auth.user?.updatedAt) {
        body = JSON.stringify({
          id: auth.userId,
          name: auth.user?.username,
          email: auth.user?.emailAddresses[0]?.emailAddress,
          role: "candidate" // todo: don't hardcode this
        });
      // other just upsert to update the updatedAt key
      } else {
        body = JSON.stringify({
          id: auth.userId,
        });
      }

      // don't wait for the response
      fetch('/api/user/upsert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }).then((res) => {
        if (res.status !== 200) {
          console.error('Failed to update user session', res);
        } else {
          console.log('User session updated', res);
        }
      }
      ).catch((err) => {
        console.error('Failed to update user session', err);
      });
    }
  },
});

export const config = {
  // Protects all routes, including api/trpc.
  // See https://clerk.com/docs/references/nextjs/auth-middleware
  // for more information about configuring your Middleware
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
