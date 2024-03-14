import { useQuery } from '@tanstack/react-query';
import { getUserDetails } from './fetch';
import { useUser } from '@clerk/nextjs';

import type { CandidateResume } from '@/types';
import type { UserResource } from '@clerk/types';

type UserDetailsResponse = {
  user: {
    resumes: CandidateResume[];
  }
};

export const useUserDetails = (): {
  data?: UserDetailsResponse;
  isLoading: boolean;
  isError: boolean;
  user: UserResource | null | undefined;
} => {
  const { user } = useUser();

  const { data, isLoading, isError } = useQuery<UserDetailsResponse>({
    queryKey: ['user', user?.id],
    queryFn: () => getUserDetails(user?.id || ''),
    enabled: !!user?.id,
  });

  return { data, user, isLoading, isError };
};
