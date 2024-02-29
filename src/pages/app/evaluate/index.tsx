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
    id: string;
    question: string;
    type: string;
    // question_topic?: string;
    choices?: string[];
    correctAnswer: string;
    selectedAnswer?: string;
  }[];
};

type GenerateAssessmentMutationRequest = {
  stack: TechStack;
};

type EvaluateFreeQuestionsMutationRequest = {
  questions: {
    id: string;
    answer: string;
    question: string;
  }[];
};

const testAssessment = [
  {
    id: '4711f008-e1b9-45df-8afb-de1c06f7273d',
    question: 'How does React use the Virtual DOM to optimize UI updates?',
    type: 'FREE_RESPONSE',
    choices: [],
    correctAnswer: '',
    createdAt: '2024-02-29T01:15:45.684Z',
    updatedAt: '2024-02-29T01:15:45.684Z',
    assessmentId: '73614b5b-2157-4dca-905d-a4d8de5e4edc',
  },
  {
    id: 'e934d3c2-b742-4c19-b533-33ada2648af3',
    question:
      'In Node.js, how can you implement a child process with spawn method?',
    type: 'FREE_RESPONSE',
    choices: [],
    correctAnswer: '',
    createdAt: '2024-02-29T01:15:45.684Z',
    updatedAt: '2024-02-29T01:15:45.684Z',
    assessmentId: '73614b5b-2157-4dca-905d-a4d8de5e4edc',
  },
  {
    id: 'fcf37439-6fcf-4988-9272-67ce536dd75b',
    question: "Explain the concept of 'context' in Go and its usage.",
    type: 'MULTIPLE_CHOICE',
    choices: [
      'It is used for storing global variables',
      'It is used for passing values down the function stack',
      'It is used for memory management',
      'None of the above',
    ],
    correctAnswer: 'It is used for passing values down the function stack',
    createdAt: '2024-02-29T01:15:45.684Z',
    updatedAt: '2024-02-29T01:15:45.684Z',
    assessmentId: '73614b5b-2157-4dca-905d-a4d8de5e4edc',
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

const generateAssessment = async ({
  stack,
}: GenerateAssessmentMutationRequest) => {
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

const evaluateQuestions = async (
  questions: EvaluateFreeQuestionsMutationRequest
) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/assessments/evaluate/questions`,
    {
      method: 'POST',
      body: JSON.stringify(questions),
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
    GenerateAssessmentMutationRequest
  >({
    mutationFn: generateAssessment,
    onSuccess: (res) => {
      setAssessment(res);
    },
  });

  const { mutate: evaluateQuestionsMutation } = useMutation<
    void,
    Error,
    EvaluateFreeQuestionsMutationRequest
  >({
    mutationFn: evaluateQuestions,
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
          newQuestions[questionIdx].selectedAnswer =
            newQuestions[questionIdx].choices?.[chosenOption];
        } else {
          newQuestions[questionIdx].selectedAnswer = chosenOption;
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
  const handleAssessmentSubmit = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    // get answers that were correct
    const correctAnswers = assessment?.questions.filter(
      (question) => question.selectedAnswer === question.correctAnswer
    );

    // now get free response answers
    const freeResponse = assessment?.questions
      .filter((question) => question.type === 'FREE_RESPONSE')
      .map((question) => ({
        id: question.id,
        answer: question.selectedAnswer as string,
        question: question.question,
      }));

    // send them to the backend to be graded
    if (freeResponse) {
      evaluateQuestionsMutation({
        questions: freeResponse,
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
        <form className="flex flex-col items-center space-y-8">
          {assessment.questions.map((question, index) => (
            // todo: abstract this into a component?
            <div
              key={index}
              className="my-4 md:w-3/4 w-full border border-gray-300 p-4 pt-0 rounded-lg"
            >
              <Heading variant="h2">{question.question}</Heading>
              {question.type === 'MULTIPLE_CHOICE' ? (
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
