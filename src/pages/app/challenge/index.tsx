import { useCallback, useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { Heading } from '@/components/atoms/heading';
import { Container } from '@/components/layouts/container';
import { Alert } from '@/components/molecules/alert';
import { TechStackList } from '@/components/organisms/tech-stack-list';
import { Button } from '@/components/ui/button';

import type { Tech, TechStack } from '@/types';
import { Editor } from '@/components/organisms/editor';

type CreateMutationResponse = {
  challenge: string;
};

const createChallenge = async (tech: Tech) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/assessments/challenge/create`,
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

type EvaluateMutationResponse = {
  code_quality: number;
  code_correctness: number;
  code_efficiency: number;
  code_maintainability: number;
  feedback_message: string;
};

const evaluateChallenge = async ({
  devResponse,
  challenge,
}: {
  devResponse: string;
  challenge: string;
}) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/assessments/challenge/evaluate`,
    {
      method: 'POST',
      body: JSON.stringify({ devResponse, challenge }),
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
  const [evaluation, setEvaluation] =
    useState<EvaluateMutationResponse | null>();

  const { mutate, isPending } = useMutation<
    CreateMutationResponse,
    Error,
    Tech
  >({
    mutationFn: createChallenge,
    onSuccess: (data) => {
      setChallenge(data.challenge);
    },
  });

  const { mutate: evaluate, isPending: isEvaluating } = useMutation<
    EvaluateMutationResponse,
    Error,
    { devResponse: string; challenge: string }
  >({
    mutationFn: evaluateChallenge,
    onSuccess: (data) => {
      setEvaluation(data);
    },
  });

  const handleCreateChallenge = useCallback(async () => {
    if (techStack.length > 0) {
      mutate(techStack[0]);
    } else {
      // todo: use a toast or a modal
      alert('Please choose a technology');
    }
  }, [mutate, techStack]);

  const handleEvaluateChallenge = useCallback(
    async (code: string) => {
      evaluate({ devResponse: code, challenge });
    },
    [evaluate, challenge]
  );

  const content = useMemo(() => {
    switch (true) {
      case !challenge:
        return (
          <>
            <Alert
              className="w-[20rem] my-4 disable-highlight"
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
        );
      case challenge && !evaluation:
        return (
          <>
            <Alert
              title="Challenge"
              description={`Your challenge is ${challenge}`}
              className="my-4 w-[90%] md:w-[80%]"
            />
            <Editor
              value=""
              language="javascript"
              isLoading={isEvaluating}
              onSubmit={handleEvaluateChallenge}
            />
          </>
        );
      case !!evaluation:
        return (
          <ul>
            <li>Code Quality: {evaluation.code_quality}</li>
            <li>Code Correctness: {evaluation.code_correctness}</li>
            <li>Code Efficiency: {evaluation.code_efficiency}</li>
            <li>Code Maintainability: {evaluation.code_maintainability}</li>
            <li>Feedback Message: {evaluation.feedback_message}</li>
          </ul>
        );
      default:
        return null;
    }
  }, [
    challenge,
    evaluation,
    isEvaluating,
    isPending,
    techStack,
    handleCreateChallenge,
    handleEvaluateChallenge,
  ]);

  return (
    <Container>
      <Heading variant="h1">Code Challenge</Heading>
      {content}
    </Container>
  );
}
