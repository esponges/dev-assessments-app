import { useRouter } from 'next/router';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { Container } from '@/components/layouts/container';
import { Alert } from '@/components/molecules/alert';
import { Button } from '@/components/ui/button';
import { TechStackList } from '@/components/organisms/tech-stack-list';
import { Label } from '@/components/ui/label';

import type { TechStack } from '@/types';
import { Heading } from '@/components/atoms/heading';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

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
    correct_answer: string;
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
  // see backend code for the actual prompt structure
  const ASSESSMENT_PROMPT_TYPE = 4;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/assessments/create`,
    {
      method: 'POST',
      body: JSON.stringify({
        stack,
        promptOpt: ASSESSMENT_PROMPT_TYPE,
        number_of_questions: 10, // hard coded for now
      }),
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

export default function Evaluate() {
  const router = useRouter();
  const { id } = router.query;
  const [assessment, setAssessment] = useState<Assessment | null>();
  const [techStack, setTechStack] = useState<TechStack>([]);

  // todo: this might be done elsewhere, probably when the page is loaded and the
  // candidate is authenticated
  const { data } = useQuery<DevDetails>({
    queryKey: ['dev', id],
    queryFn: () => getDevDetails(id as string),
    enabled: !!id,
  });

  const { mutate: createAssessment, isPending } = useMutation<
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

  return (
    <Container className="px-6">
      {!assessment ? (
        <>
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
            className="mt-10"
            onClick={handleGenerateAssessment}
            disabled={!techStack.length || isPending}
          >
            {isPending ? 'Generating...' : 'Generate Assessment'}
          </Button>
        </>
      ) : (
        assessment.questions.map((question, index) => (
          // todo: abstract this into a component?
          <form
            key={index}
            className="my-4 md:w-3/4 w-full border border-gray-300 p-4 pt-0 rounded-lg"
          >
            <Heading variant="h2">{question.question_text}</Heading>
            {question.question_type === 'MULTIPLE_CHOICE' ? (
              <RadioGroup>
                {question.choices?.map((choice, i) => (
                  <div
                    key={i}
                    className="flex items-center space-x-2"
                  >
                    <RadioGroupItem
                      id={choice}
                      value={choice}
                    />
                    <Label htmlFor={choice}>{choice}</Label>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              // todo: use embedded editor instead
              <textarea
                className="w-full h-24 p-2 border border-gray-300 rounded-lg"
                placeholder="Type your answer here"
              />
            )}
          </form>
        ))
      )}
    </Container>
  );
}
