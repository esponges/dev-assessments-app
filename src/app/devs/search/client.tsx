"use client";

import { useEffect, useState } from 'react';
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
import { Heading } from '@/components/atoms/heading';

import type { TechStack } from '@/types';

type DevProfileResponse = {
  searchResults: {
    similaritySearchResults: {
      matches: {
        id: string;
        score: number;
        values: number[];
        metadata: {
          id: string;
          tech_stack: string[];
        };
      }[];
      namespace: string;
    };
    questions: string[];
  };
  candidates: {
    id: string;
    resume: string;
    techStack: string[];
    detailedTechStack: TechStack;
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

export function DevSimilaritySearch() {
  const [description, setDescription] = useState('');
  const [candidates, setCandidates] = useState<DevProfileResponse['candidates']>();
  const { data, isLoading, refetch } = useQuery<DevProfileResponse>({
    queryKey: ['profiles'],
    queryFn: () => getCandidatesProfiles(description),
    enabled: false,
  });

  useEffect(() => {
    if (data) {
      setCandidates(data.candidates);
    }
  }, [data]);

  const handleGetProfiles = async () => {
    refetch();
  };

  const handleDownloadResume = async (id: string) => {
    alert(`Downloading resume for ${id} (not implemented)`);
  };

  return (
    <Container className="w-full md:w-full md:px-12">
      {!candidates || !description ? (
        <>
          <Alert
            title="What kind of developer are you looking for?"
            description={`Briefly describe the kind of developer you are looking for
             and we will find the best match for you.`}
          />
          <Textarea
            placeholder="We are looking for a senior developer with React, Node.js, and MongoDB experience."
            className="mt-4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button
            onClick={handleGetProfiles}
            className="mt-4"
            disabled={isLoading || !description}
          >
            {isLoading ? 'Loading...' : 'Get Profiles'}
          </Button>
        </>
      ) : (
        <>
          <Heading variant='h1' className="my-6">
            We found {candidates.length} profiles that match your search
          </Heading>
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
              {candidates.map((candidate) => (
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
              setCandidates(undefined);
            }}
            className="mt-4"
          >
            Try another search
          </Button>
        </>
      )}
    </Container>
  );
}
