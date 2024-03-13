'use client';

import { useMemo } from 'react';
import { Container } from '@/components/layouts/container';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useQuery } from '@tanstack/react-query';
import { useUser } from '@clerk/nextjs';

import type { TechStack } from '@/types';

type CandidateResume = {
  id: string;
  userId: string;
  resume: string;
  techStack: string[];
  detailedTechStack: TechStack[];
  createdAt: string;
  updatedAt: string;
};

const fetchUserDetails = async (id: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/candidate/details?id=${id}`
  );

  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
};

export function UserDetails() {
  const { user } = useUser();

  const { data, isLoading, isError } = useQuery<CandidateResume[]>({
    queryKey: ['user', user?.id],
    queryFn: () => fetchUserDetails(user?.id || ''),
    enabled: !!user?.id,
  });

  const toRender = useMemo(() => {
    if (isLoading || !data) {
      return <div>Loading...</div>;
    } else if (isError) {
      return <div>Error</div>;
    } else if (data.length > 0) {
      return (
        <Table>
          <TableCaption>User Details</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Resume</TableHead>
              <TableHead>Tech Stack</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((resume) => (
              <TableRow key={resume.id}>
                <TableCell>{resume.resume}</TableCell>
                <TableCell>{resume.techStack.join(', ')}</TableCell>
                <TableCell>{resume.createdAt}</TableCell>
                <TableCell>{resume.updatedAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    } else {
      return <div>No details found</div>;
    }
  }, [data, isLoading, isError]);

  return <Container>{toRender}</Container>;
}
