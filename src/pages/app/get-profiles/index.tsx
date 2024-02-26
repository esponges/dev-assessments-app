import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { Container } from '@/components/layouts/container';
import { Alert } from '@/components/molecules/alert';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type Response = {
  searchResults: {
    similaritySearchResults: {
      matches: {
        id: string;
        score: number;
        values: any[];
        metadata: {
          id: string;
          tech_stack: string[];
        };
      }[];
      namespace: string;
    };
    questions: any[];
  };
  candidates: {
    id: string;
    resume: string;
    techStack: string[];
    createdAt: string;
    updatedAt: string;
    score: number;
    metadata: {
      id: string;
      tech_stack: string[];
    };
  }[];
};

const getCandidatesProfiles = async (description: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/candidate/similarity_search`,
    {
      method: 'POST',
      body: JSON.stringify({ description }),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!res.ok) {
    throw new Error('Network response was not ok');
  }

  const json = await res.json();
  return json;
};

export default function DevProfiles() {
  const [description, setDescription] = useState('');
  const { data, isLoading, refetch } = useQuery<Response>({
    queryKey: ['profiles'],
    queryFn: () => getCandidatesProfiles(description),
    enabled: false,
  });

  const handleGetProfiles = async () => {
    refetch();
  };

  const handleDownloadResume = async (id: string) => {
    alert(`Downloading resume for ${id} (not implemented)`);
  };

  return (
    <Container className='w-full md:w-full md:px-12'>
      {!data || !description ? (
        <>
          <Alert
            title='What kind of developer are you looking for?'
            description='Briefly describe the kind of developer you are looking for and we will find the best match for you.'
          />
          <Textarea
            placeholder='We are looking for a senior developer with React, Node.js, and MongoDB experience.'
            className='mt-4'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button
            onClick={handleGetProfiles}
            className='mt-4'
            disabled={isLoading || !description}
          >
            {isLoading ? 'Loading...' : 'Get Profiles'}
          </Button>
        </>
      ) : (
        <>
          <h1 className='my-6'>
            We found {data.candidates.length} profiles that match your
            search
          </h1>
          {/* todo: create reusable table component */}
          <Table>
            <TableCaption>Profiles</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Profile</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Technologies</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.candidates.map((candidate) => (
                <TableRow key={candidate.id}>
                  <TableCell>{candidate.id}</TableCell>
                  <TableCell>{candidate.score}</TableCell>
                  <TableCell>{candidate.techStack.join(', ')}</TableCell>
                  <TableCell>
                    <Button
                      onClick={(_e) => handleDownloadResume(candidate.id)}
                    >
                      Download Resume
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button
            onClick={() => {
              setDescription('');
            }}
            className='mt-4'
          >
            Try another search
          </Button>
        </>
      )}
    </Container>
  );
}
