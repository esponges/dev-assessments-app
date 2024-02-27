import { useRouter } from 'next/router';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { Container } from '@/components/layouts/container';
import { Alert } from '@/components/molecules/alert';
import { Button } from '@/components/ui/button';

import type { TechStack } from '@/types';
import { TechStackList } from '@/components/organisms/tech-stack-list';

type DevDetails = {
  id: string;
  resume: string;
  techStack: string[];
  detailedTechStack: TechStack;
};

type Assessment = {
  title: string;
  questions: {
    question_text: string;
    question_type: string;
    question_topic: string;
    choices?: string[];
    correct_answer?: string;
  }[];
};

type MutationVariables = {
  stack: TechStack;
};

const getDevDetails = async (id: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/candidate/details?id=${id}`
  );

  if (!res.ok) {
    throw new Error('Network response was not ok');
  }

  const json = await res.json();

  return json;
};

const generateAssessment = async ({ stack }: MutationVariables) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/assessment/create`,
    {
      method: 'POST',
      body: JSON.stringify({
        stack,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!res.ok) {
    throw new Error('Network response was not ok');
  }

  const json = (await res.json()) as Assessment;

  return json;
};

export default function Evaluate() {
  const router = useRouter();
  const { id } = router.query;
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [techStack, setTechStack] = useState<TechStack>([]);

  // todo: this might be done elsewhere, probably when the page is loaded and the
  // candidate is authenticated
  const { data } = useQuery<DevDetails>({
    queryKey: ['dev', id],
    queryFn: () => getDevDetails(id as string),
    enabled: !!id,
  });

  const { mutate: createAssessment } = useMutation<
    Assessment,
    Error,
    MutationVariables
  >({
    mutationFn: generateAssessment,
    onSuccess: (res) => {
      setAssessment(res);
    },
  });

  useEffect(() => {
    if (data) {
      setTechStack(data.detailedTechStack);
    }
  }, [data]);

  const handleGenerateAssessment = async () => {
    // don't send 0 experience
    const nonZeroStack = techStack.filter((el) => el.experience > 0);

    // todo: probably just pick the stack elements with the biggest experience?

    if (data) {
      createAssessment({
        stack: nonZeroStack,
      });
    }
  };

  console.log('assessment', assessment);

  return (
    <Container className="px-6">
      <h1 className="text-2xl font-bold my-4">Your Stack (years)</h1>
      <Alert
        className="w-[20rem] my-4"
        title="Evaluation criteria"
        description="You will be evaluated based on the following tech stack"
      />
      {techStack.length > 0 ? (
        <TechStackList
          stack={techStack}
          setStack={setTechStack}
        />
      ) : null}
      <Button
        type="submit"
        className="my-4"
        onClick={handleGenerateAssessment}
        disabled={!techStack.length}
      >
        Generate assessment
      </Button>
      {assessment && <pre>{JSON.stringify(assessment, null, 2)}</pre>}
    </Container>
  );
}
