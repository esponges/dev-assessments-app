import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { Heading } from '@/components/atoms/heading';
import { Container } from '@/components/layouts/container';
import { Alert } from '@/components/molecules/alert';
import { TechStackList } from '@/components/organisms/tech-stack-list';
import { Button } from '@/components/ui/button';

import type { Tech, TechStack } from '@/types';

type MutationResponse = {
  challenge: string;
};

const createChallenge = async (tech: Tech) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/assessment/challenge/create`,
    {
      method: 'POST',
      body: JSON.stringify(tech),
    }
  );

  if (!res.ok) {
    throw new Error('Network response was not ok');
  }

  const json = await res.json();

  return json;
};

const MOCKED_CHALLENGE = `Using React, your challenge is to develop a Higher Order Component (HOC) 
that provides theming capabilities to any component. \n\n
This HOC should be able to get a 'theme' prop and pass a 'style' prop to its child component. 
The 'style' prop will change depending on the 'theme' prop. Create two possible themes: 'light' and 'dark', 
and define them as you see fit. The child component should render differently based 
on the 'style' prop provided by the HOC. \n\nRemember, no actual styling is necessary, 
but describe what the 'style' prop objects would look like for each theme. Additionally, 
discuss how you might modify this HOC to support adding an arbitrary number of new themes. \n\n
This problem tests your understanding of HOCs, props forwarding, theme management, and dynamic styling in React.`;

const MOCKED_TECH_STACK: TechStack = [
  {
    tech: 'React',
    experience: 2,
  },
];

export default function Challenge() {
  const [techStack, setTechStack] = useState<TechStack>(MOCKED_TECH_STACK);
  const [challenge, setChallenge] = useState<string>(MOCKED_CHALLENGE);

  const { mutate, isPending } = useMutation<MutationResponse, Error, Tech>({
    mutationFn: createChallenge,
    onSuccess: (data) => {
      setChallenge(data.challenge);
    },
  });

  const handleCreateChallenge = async () => {
    if (techStack.length > 0) {
      mutate(techStack[0]);
    } else {
      // todo: use a toast or a modal
      alert('Please choose a technology');
    }
  };

  return (
    <Container>
      <Heading variant="h1">Code Challenge</Heading>
      {!challenge ? (
        <>
          <Alert
            className="w-[20rem] my-4"
            title="Please choose one technology from your tech stack"
            description="You will be given a code challenge based on the technology you choose"
          />
          {/* todo: force this component to use X number of stacks */}
          <TechStackList
            stack={techStack}
            setStack={setTechStack}
          />
          <Button
            className="my-4"
            onClick={handleCreateChallenge}
            disabled={isPending}
          >
            {isPending ? 'Loading...' : 'Create Challenge'}
          </Button>
        </>
      ) : (
        // todo: use a component that accepts markdown
        <Alert
          title="Challenge created"
          description={`Your challenge is ${challenge}`}
          className="my-4"
        />
      )}
    </Container>
  );
}
