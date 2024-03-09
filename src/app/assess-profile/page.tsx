import { AssessProfile } from './client';
import { ServerComponentTest } from './server';

// using this pattern we latter can pass server components
// as children to the client components so they are not bundled
// with the client component nor require the use client directive
// todo: remove this once we have this very clear
export default function Page() {
  return (
    <AssessProfile>
      <ServerComponentTest />
    </AssessProfile>
  );
}
