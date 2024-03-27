'use client';

import { useCallback, useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { Heading } from '@/components/atoms/heading';
import { Container } from '@/components/layouts/container';
import { Alert } from '@/components/molecules/alert';
import { TechStackList } from '@/components/organisms/tech-stack-list';
import { Button } from '@/components/ui/button';

import type { Tech, TechStack } from '@/types';
import { Editor } from '@/components/organisms/editor';
import { useUserDetails } from '@/lib/hooks';
import { Modal } from '@/components/molecules/modal';

type CreateMutationResponse = {
  challenge: string;
};

const createChallenge = async (tech: Tech) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/assessments/challenge/create`,
    {
      method: 'POST',
      body: JSON.stringify(tech),
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

const MOCKED_EVALUATION: EvaluateMutationResponse = {
  code_quality: 95,
  code_correctness: 100,
  code_efficiency: 90,
  code_maintainability: 90,
  feedback_message: `Your solution is excellent, demonstrating a strong understanding of 
    Higher Order Components and dynamic styling. The code is clean, well-structured, 
    following best practices such as destructuring props and usage of typescript types. 
    However, consider adding comments to your code for improved readability and 
    maintainability. Furthermore, you could think about strategies for managing 
    themes more efficiently when the number of themes grows.`,
};

function PendingChallenge({ isCreating }: { isCreating?: boolean }) {
  return (
    <Alert
      classNames={{
        main: 'w-[20rem] my-4',
      }}
      title={`${isCreating ? 'Generating' : 'Evaluating'} Assessment`}
      description={`Please wait while we ${
        isCreating ? 'create' : 'evaluate'
      } your challenge`}
    />
  );
}

export function Challenge() {
  const [challenge, setChallenge] = useState<string>(MOCKED_CHALLENGE);
  const [solution, setSolution] = useState<string>('');
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [evaluation, setEvaluation] =
    useState<EvaluateMutationResponse | null>();

  const { latestTechStack: techStack } = useUserDetails();

  const selectedStackYears = useMemo(() => {
    if (!selectedTech) return 0;

    const selectedStack = techStack.find((el) => el.tech === selectedTech);

    return selectedStack?.experience || 0;
  }, [selectedTech, techStack]);

  const { mutate: create, isPending } = useMutation<
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
      create({
        tech: selectedTech as string,
        experience: selectedStackYears,
      });
    } else {
      // todo: use a toast or a modal
      alert('Please choose a technology');
    }
  }, [create, techStack, selectedTech, selectedStackYears]);

  const handleEvaluateChallenge = useCallback(
    async () => {
      evaluate({ devResponse: solution, challenge });
    },
    [evaluate, challenge, solution]
  );

  const content = useMemo(() => {
    switch (true) {
      case isPending || isEvaluating:
        return <PendingChallenge isCreating={isPending} />;
      case !challenge:
        return (
          <>
            <Alert
              classNames={{ main: 'w-[20rem] my-4' }}
              title="Please select the technology from your tech stack"
              description="You will be evaluated in ONE of the technologies of your choice from your tech stack"
            />
            {/* todo: force this component to use X number of stacks */}
            <TechStackList
              stack={techStack}
              useSelectLabelButton
              title="Select Technology"
              showAddTech={false}
              onOptionClick={setSelectedTech}
            />
            {selectedTech ? (
              <div className="my-4 text-center">
                <Alert
                  variant="destructive"
                  description={`
                  You will be evaluated in the following technology ONLY. 
                  You can later be evaluated in other technologies.
                  `}
                />
                <Heading variant="h1">{`${selectedStackYears} years of experience in ${selectedTech}`}</Heading>
              </div>
            ) : null}
            <Button
              className="my-4"
              onClick={handleCreateChallenge}
              disabled={isPending || !selectedTech}
            >
              {isPending
                ? 'Loading...'
                : `Start ${selectedTech || ''} Challenge`}
            </Button>
          </>
        );
      case challenge && !evaluation:
        return (
          <>
            <Alert
              title="Challenge"
              description={`Your challenge is ${challenge}`}
              classNames={{
                main: ' my-4 w-[90%] md:w-[80%]',
                description: 'disable-highlight',
              }}
            />
            <Editor
              value=""
              language="javascript"
              isLoading={isEvaluating}
              onSubmit={handleEvaluateChallenge}
              onEditorChange={setSolution}
            />
            <Modal
              _id="modal"
              title="Are you sure you want to submit your challenge?"
              content="This action cannot be undone."
              triggerContent={
                <Button className="mt-4">Submit challenge</Button>
              }
              onAccept={handleEvaluateChallenge}
            />
          </>
        );
      case !!evaluation:
        return (
          <ul className="w-3/4">
            <Heading variant="h4">Code Quality</Heading>
            <p>{evaluation.code_quality}</p>
            <Heading variant="h4">Code Correctness</Heading>
            <p>{evaluation.code_correctness}</p>
            <Heading variant="h4">Code Efficiency</Heading>
            <p>{evaluation.code_efficiency}</p>
            <Heading variant="h4">Code Maintainability</Heading>
            <p>{evaluation.code_maintainability}</p>
            <Heading variant="h4">Feedback Message</Heading>
            <p>{evaluation.feedback_message}</p>
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
    selectedTech,
    selectedStackYears,
  ]);

  return (
    <Container>
      {!evaluation ? (
        <Heading variant="h1">Code Challenge</Heading>
      ) : (
        <Heading variant="h2">Evaluation Results</Heading>
      )}
      {content}
    </Container>
  );
}
