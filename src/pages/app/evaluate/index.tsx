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
import { Editor } from '@/components/organisms/editor';

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
    text: string;
    type: string;
    // question_topic?: string;
    choices?: string[];
    selectedAnswer?: string;
    // once evaluated by the backend
    correctAnswer?: string;
    score?: number;
    feedbackMessage?: string;
    inputType?: 'text' | 'code';
  }[];
};

type GenerateAssessmentMutationRequest = {
  stack: TechStack;
};

type EvaluateAssessmentMutationRequest = {
  questions: {
    id: string;
    answer: string;
  }[];
};

type EvaluateAssessmentMutationResponse = {
  totalScore: number;
  evaluatedAssessment: Assessment['questions'];
};

const testAssessment = [
  {
    id: '4711f008-e1b9-45df-8afb-de1c06f7273d',
    text: 'How does React use the Virtual DOM to optimize UI updates?',
    type: 'FREE_RESPONSE',
    choices: [],
    correctAnswer: '',
    createdAt: '2024-02-29T01:15:45.684Z',
    updatedAt: '2024-02-29T01:15:45.684Z',
    assessmentId: '73614b5b-2157-4dca-905d-a4d8de5e4edc',
    // inputType: 'code',
  },
  {
    id: 'e934d3c2-b742-4c19-b533-33ada2648af3',
    text: 'In Node.js, how can you implement a child process with spawn method?',
    type: 'FREE_RESPONSE',
    choices: [],
    correctAnswer: '',
    createdAt: '2024-02-29T01:15:45.684Z',
    updatedAt: '2024-02-29T01:15:45.684Z',
    assessmentId: '73614b5b-2157-4dca-905d-a4d8de5e4edc',
  },
  {
    id: 'fcf37439-6fcf-4988-9272-67ce536dd75b',
    text: "Explain the concept of 'context' in Go and its usage.",
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
        number_of_questions: 3, // hard coded for now
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
  questions: EvaluateAssessmentMutationRequest
) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/assessments/questions/evaluate`,
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
  const [candidateId, setCandidateId] = useState<string | null>(id as string);
  const [assessment, setAssessment] = useState<Assessment | null>({
    title: 'Tech Stack Evaluation',
    questions: testAssessment,
  });
  const [techStack, setTechStack] = useState<TechStack>([]);

  // todo: this probably should be done elsewhere, probably when the page is loaded and the
  // candidate is authenticated
  const { data } = useQuery<DevDetails>({
    queryKey: ['candidate', candidateId],
    queryFn: () => getDevDetails(candidateId || ''),
    enabled: !!candidateId,
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
    EvaluateAssessmentMutationResponse,
    Error,
    EvaluateAssessmentMutationRequest
  >({
    mutationFn: evaluateQuestions,
    onSuccess: (res) => {
      setAssessment((prev) => {
        if (prev) {
          return {
            ...prev,
            questions: res.evaluatedAssessment,
          };
        }

        return prev;
      });
    },
  });

  useEffect(() => {
    if (data) {
      setTechStack(data.detailedTechStack);
    }
  }, [data]);

  // todo: will be used to prevent accidental page navigation
  // useEffect(() => {
  //   const confirmationMessage = 'Tus cambios se perderán. ¿Estás seguro?';

  //   // none of these two work - however the default message is ok for now
  //   const beforeUnloadHandler = (e: WindowEventMap['beforeunload']) => {
  //     e.returnValue = confirmationMessage;
  //     return confirmationMessage; // Gecko + Webkit, Safari, Chrome etc.
  //   };

  //   window.onbeforeunload = (e: BeforeUnloadEvent) => {
  //     e.returnValue = confirmationMessage;
  //     return confirmationMessage;
  //   };

  //   const beforeRouteHandler = (url: string) => {
  //     if (router.pathname !== url /* && !confirm(confirmationMessage) */) {
  //       // handleAssessmentDonePrompt();
  //       // to inform NProgress or something ...
  //       router.events.emit('routeChangeError');
  //       // to prevent the transition
  //       // eslint-disable-next-line no-throw-literal
  //       throw `Route change to "${url}" was aborted (this error can be safely ignored).
  //       See https://github.com/zeit/next.js/issues/2476.`;
  //     }
  //   };

  //   // if (!isDone.complete) {
  //   //   window.addEventListener('beforeunload', beforeUnloadHandler);
  //   //   router.events.on('routeChangeStart', beforeRouteHandler);
  //   // }

  //   // // let the user leave the page
  //   // if (isDone.complete || leaveIncomplete || assessmentFetchError) {
  //   //   window.removeEventListener('beforeunload', beforeUnloadHandler);
  //   //   router.events.off('routeChangeStart', beforeRouteHandler);
  //   // }
  //   window.addEventListener('beforeunload', beforeUnloadHandler);
  //   router.events.on('routeChangeStart', beforeRouteHandler);

  //   // clean up listener on unmount
  //   return () => {
  //     window.removeEventListener('beforeunload', beforeUnloadHandler);
  //     router.events.off('routeChangeStart', beforeRouteHandler);
  //   };
  // }, [router.events, router.pathname]);

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

  const handleInputTypeChange = (type: 'text' | 'code', idx: number) => {
    setAssessment((prev) => {
      if (prev) {
        const newQuestions = [...prev.questions];

        newQuestions[idx].inputType = type;

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

    // todo: prevent submission if not all questions are answered
    const questions = assessment?.questions.map((question) => ({
      id: question.id,
      answer: question.selectedAnswer as string,
    }));

    // send them to the backend to be graded
    if (questions) {
      evaluateQuestionsMutation({
        questions,
      });
    }
  };

  const renderFreeResponse = (type: 'text' | 'code', idx: number) => {
    return (
      <div>
        {type === 'text' ? (
          <textarea
            onChange={(e) => handleOptionChange(e.target.value, 0)}
            className="w-full h-24 p-2 border border-gray-300 rounded-lg"
            placeholder={`Type your ${type} answer here`}
          />
        ) : (
          <Editor
            value=""
            language="javascript"
            onChange={(value) => handleOptionChange(value || '', 0)}
            height="10rem"
            classNames={{
              main: 'md:w-full',
            }}
          />
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            handleInputTypeChange(type === 'text' ? 'code' : 'text', idx);
          }}
          className="text-blue-500 text-xs underline"
        >
          {type === 'text' ? 'Switch to code' : 'Switch to text'}
        </button>
      </div>
    );
  };

  return (
    <Container className="px-6">
      {!assessment ? (
        <>
          <Alert
            classNames={{
              main: 'w-[20rem] my-4',
            }}
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
              <Heading
                variant="h2"
                className="disable-highlight"
              >
                {question.text}
              </Heading>
              {question.type === 'MULTIPLE_CHOICE' ? (
                <RadioGroup>
                  {question.choices?.map((choice, i) => (
                    <div
                      key={i}
                      className="flex items-center space-x-2 disable-highlight"
                      onChange={() => handleOptionChange(i, index)}
                    >
                      <RadioGroupItem
                        id={choice}
                        value={choice}
                        className="disable-highlight"
                      />
                      <Label htmlFor={choice}>{choice}</Label>
                    </div>
                  ))}
                </RadioGroup>
              ) : (
                renderFreeResponse(question.inputType || 'text', index)
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
      {/* set candidate id for a different stack */}
      <Heading
        variant="h3"
        className="mt-8"
      >
        Or evaluate a different candidate
      </Heading>
      <form
        className="flex flex-col items-center space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);

          setCandidateId(formData.get('candidateId') as string);
        }}
      >
        <input
          type="text"
          name="candidateId"
          placeholder="Enter candidate id"
          className="border border-gray-300 p-2 rounded-lg"
        />
        <Button type="submit">Get Stack</Button>
      </form>
    </Container>
  );
}
