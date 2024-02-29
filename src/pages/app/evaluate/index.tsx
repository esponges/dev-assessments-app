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
    selected_answer?: string;
  }[];
};

type MutationVariables = {
  stack: TechStack;
};

const testAssessment = [
  {
    question_text:
      'What is a key difference between class and functional components in React?',
    question_type: 'MULTIPLE_CHOICE',
    question_topic: 'React',
    choices: [
      "Class components have state, functional components don't",
      "Functional components have state, class components don't",
      'Class components are written in JavaScript, functional components in TypeScript',
      "Functional components use render(), class components don't",
    ],
    correct_answer: "Class components have state, functional components don't",
  },
  {
    question_text: 'What does redux help you manage in your application?',
    question_type: 'MULTIPLE_CHOICE',
    question_topic: 'Redux',
    choices: [
      'Server requests',
      'Database queries',
      'Application state',
      'UI Library installation',
    ],
    correct_answer: 'Application state',
  },
  {
    question_text: 'What problem does TypeScript solve?',
    question_type: 'FREE_RESPONSE',
    question_topic: 'TypeScript',
    choices: [],
    correct_answer:
      'TypeScript adds static types to JavaScript, helping to catch errors early in the development process',
  },
  {
    question_text: 'What is a snapshot test in Jest?',
    question_type: 'MULTIPLE_CHOICE',
    question_topic: 'Jest',
    choices: [
      'A test that checks if the application state matches a snapshot in time',
      'A test that checks if the UI matches a stored snapshot',
      'A test that checks if the UI loads within a specified time',
      'A test that takes a literal snapshot of the UI state',
    ],
    correct_answer: 'A test that checks if the UI matches a stored snapshot',
  },
  {
    question_text: 'What is the primary function of GraphQL?',
    question_type: 'FREE_RESPONSE',
    question_topic: 'GraphQL',
    choices: [],
    correct_answer: `GraphQL is a specification for how to request and return data from servers to clients. 
      It provides a more efficient, powerful and flexible alternative to REST`,
  },
];

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
        number_of_questions: 2, // hard coded for now
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
  const [assessment, setAssessment] = useState<Assessment | null>({
    title: 'some assessment',
    questions: testAssessment,
  });
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

  const handleOptionChange = (
    chosenOption: number | string,
    questionIdx: number
  ) => {
    setAssessment((prev) => {
      if (prev) {
        const newQuestions = [...prev.questions];

        if (typeof chosenOption === 'number') {
          newQuestions[questionIdx].selected_answer =
            newQuestions[questionIdx].choices?.[chosenOption];
        } else {
          newQuestions[questionIdx].selected_answer = chosenOption;
        }

        return {
          ...prev,
          questions: newQuestions,
        };
      }

      return prev;
    });
  };

  // use the form radio group to handle the selected answer
  const handleAssessmentSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    // get answers that were correct
    const correctAnswers = assessment?.questions.filter(
      (question) => question.selected_answer === question.correct_answer
    );

    // now get free response answers
    const freeResponse = assessment?.questions.filter(
      (question) => question.question_type === 'FREE_RESPONSE'
    );

    // send them to the backend to be graded
    console.log(correctAnswers, freeResponse);
  };

  console.log(assessment);

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
        <form className="flex flex-col items-center space-y-8">
          {assessment.questions.map((question, index) => (
            // todo: abstract this into a component?
            <div
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
                      onChange={() => handleOptionChange(i, index)}
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
                  onChange={(e) => handleOptionChange(e.target.value, index)}
                  className="w-full h-24 p-2 border border-gray-300 rounded-lg"
                  placeholder="Type your answer here"
                />
              )}
            </div>
          ))}
          <Button
            className="mt-4"
            onClick={handleAssessmentSubmit}
          >
            Submit Assessment
          </Button>
        </form>
      )}
    </Container>
  );
}
