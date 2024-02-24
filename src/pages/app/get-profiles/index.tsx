import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { Container } from '@/components/layouts/container';
import { Alert } from '@/components/molecules/alert';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const getCandidatesProfiles = async (description: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/candidate/similar_candidates`,
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
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['profiles'],
    queryFn: () => getCandidatesProfiles(description),
    enabled: false,
  });

  const handleGetProfiles = async () => {
    refetch();
  };

  console.log({ data, isLoading, isError, error });

  return (
    <Container>
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
      <Button onClick={handleGetProfiles} className='mt-4' disabled={isLoading || !description}>
        {isLoading ? 'Loading...' : 'Get Profiles'}
      </Button>
    </Container>
  );
}
