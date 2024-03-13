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
import { UseUserDetails } from '@/lib/hooks';


export function UserDetails() {
  const { data, isLoading, isError } = UseUserDetails();

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
