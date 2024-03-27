'use client';

import { useMutation } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';

import { Container } from '@/components/layouts/container';
import { Alert } from '@/components/molecules/alert';
import { Button } from '@/components/ui/button';
import { TechStackList } from '@/components/organisms/tech-stack-list';
import { Label } from '@/components/ui/label';
import { Heading } from '@/components/atoms/heading';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Modal } from '@/components/molecules/modal';
import { Editor } from '@/components/organisms/editor';

import { useUserDetails } from '@/lib/hooks';
import { cn } from '@/lib/utils';

import type { TechStack } from '@/types';

type Assessment = {
  id: string;
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
    // this doesn't exists in the backend
    inputType?: 'text' | 'code';
  }[];
};

type GenerateAssessmentMutationRequest = {
  stack: TechStack;
};

type EvaluateAssessmentMutationRequest = {
  candidateId: string;
  assessmentId: string;
  questions: {
    id: string;
    answer: string;
  }[];
};

type EvaluateAssessmentMutationResponse = {
  totalScore: number;
  evaluatedAssessment: {
    text: string;
    answer: string;
    correctAnswer: string;
    score: number;
    feedbackMessage: string;
  }[];
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
  payload: EvaluateAssessmentMutationRequest
) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/assessments/questions/evaluate`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
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

function AddResume() {
  return (
    <>
      <Alert
        classNames={{
          main: 'w-[20rem] my-4',
        }}
        title="No resume found"
        description="Please add a resume to your account to generate an assessment"
      />
      <Button
        className="mt-10"
        href="/assess-profile"
      >
        Add Resume
      </Button>
    </>
  );
}

function PendingAssessment({ isCreating }: { isCreating?: boolean }) {
  return (
    <Alert
      classNames={{
        main: 'w-[20rem] my-4',
      }}
      title={`${isCreating ? 'Generating' : 'Evaluating'} Assessment`}
      description={`Please wait while we ${
        isCreating ? 'generate' : 'evaluate'
      } your assessment`}
    />
  );
}

export function Evaluate() {
  const [timeLeft, setTimeLeft] = useState({
    initial: 1800,
    current: 1800,
    startedAt: Date.now(),
  }); // 30 minutes - hard coded for now

  // you can use the testAssessment from the test-data.ts file
  // to mock the instead of creating a new one every time
  const [assessment, setAssessment] = useState<Assessment | null>();
  const [evaluatedAssessment, setEvaluatedAssessment] =
    useState<EvaluateAssessmentMutationResponse | null>();

  const { data, user, latestTechStack: techStack } = useUserDetails();

  const { mutate: createAssessment, isPending: isCreatingAssessment } =
    useMutation<Assessment, Error, GenerateAssessmentMutationRequest>({
      mutationFn: generateAssessment,
      onSuccess: (res) => {
        setAssessment(res);
      },
    });

  const {
    mutate: evaluateQuestionsMutation,
    isPending: isEvaluatingAssessment,
  } = useMutation<
    EvaluateAssessmentMutationResponse,
    Error,
    EvaluateAssessmentMutationRequest
  >({
    mutationFn: evaluateQuestions,
    onSuccess: (res) => {
      setEvaluatedAssessment(res);
      // restart the timer
      setTimeLeft({
        initial: 1800,
        current: 1800,
        startedAt: Date.now(),
      });
    },
  });

  // reduce time left every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const elapsedTime = Date.now() - prev.startedAt;
        const newTimeLeft = prev.initial - Math.floor(elapsedTime / 1000);

        return {
          ...prev,
          current: newTimeLeft,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft.initial, timeLeft.startedAt]);

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
  const handleAssessmentSubmit = () => {
    // todo: prevent submission if not all questions are answered
    const questions = assessment?.questions.map((question) => ({
      id: question.id,
      answer: question.selectedAnswer as string,
    }));

    // send them to the backend to be graded
    if (questions) {
      evaluateQuestionsMutation({
        candidateId: user?.id || '',
        assessmentId: assessment?.id || '',
        questions,
      });
    }
  };

  const renderFreeResponse = (type: 'text' | 'code', idx: number) => {
    return (
      <div>
        {type === 'text' ? (
          <textarea
            onChange={(e) => handleOptionChange(e.target.value, idx)}
            className="w-full h-24 p-2 border border-gray-300 rounded-lg"
            placeholder={`Type your ${type} answer here`}
          />
        ) : (
          <Editor
            value=""
            language="javascript"
            onChange={(value) => handleOptionChange(value || '', idx)}
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

  const answeredQuestions = useMemo(
    () =>
      assessment?.questions.filter((question) => !!question.selectedAnswer) ||
      [],
    [assessment]
  );

  const currentTimeLeftMessage =
    timeLeft.current > 0
      ? `${Math.floor(timeLeft.current / 60)}:${
          timeLeft.current % 60 < 10 ? '0' : ''
        }${timeLeft.current % 60} left`
      : 'Time is up';

  const renderSection = () => {
    // cant use switch(true) because some cases will evaluate truthy causing a type error
    if (isCreatingAssessment || isEvaluatingAssessment) {
      return <PendingAssessment isCreating={isCreatingAssessment} />;
    } else if (data?.user?.resumes?.length === 0) {
      return <AddResume />;
    } else if (!assessment && data && data.user?.resumes?.length > 0) {
      return (
        <>
          <Alert
            classNames={{
              main: 'w-[20rem] my-4',
            }}
            title="Evaluation criteria"
            description={`You will be evaluated based on the following tech stack from you latest resume. 
            Please make sure to select the most accurate tech stack. 
            Less than 1 year of experience will not be considered.`}
          />
          {techStack.length > 0 ? (
            <TechStackList
              stack={techStack}
            />
          ) : null}
          <Button
            className="mt-10"
            onClick={handleGenerateAssessment}
            disabled={!techStack.length}
          >
            Create Assessment
          </Button>
        </>
      );
    } else if (!!evaluatedAssessment) {
      return (
        <div className="flex flex-col items-center space-y-8">
          <Heading variant="h2">Assessment Results</Heading>
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-4">
              <div>Total Score: {evaluatedAssessment.totalScore}</div>
              <Button onClick={() => setEvaluatedAssessment(null)}>
                Retake Assessment
              </Button>
            </div>
            {evaluatedAssessment.evaluatedAssessment.map((question, index) => (
              <div
                key={index}
                className="w-3/4 border border-gray-300 p-4 pt-0 rounded-lg"
              >
                <Heading
                  variant="h3"
                  className="disable-highlight"
                >
                  {question.text}
                </Heading>
                <div>
                  <div>
                    <strong>Your Answer:</strong> {question.answer}
                  </div>
                  <div>
                    <strong>Correct Answer:</strong> {question.correctAnswer}
                  </div>
                  <div>
                    <strong>Score:</strong> {question.score}
                  </div>
                  <div>
                    <strong>Feedback:</strong> {question.feedbackMessage}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    } else if (!!assessment) {
      return (
        <form className="flex flex-col items-center space-y-8">
          <div
            className={cn(`
          sticky top-0 left-0 text-white font-semibold bg-green-500 p-4 rounded-md shadow-lg
          ${timeLeft.current < 300 ? 'bg-red-400' : ''}
        `)}
          >
            <div>
              Progress:{' '}
              <span>
                {answeredQuestions.length}/{assessment.questions.length}
              </span>
            </div>
            <div className="ml-auto mr-0 flex items-center">
              {currentTimeLeftMessage}
            </div>
          </div>
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
          <Modal
            _id="modal"
            title="Are you sure you want to submit your assessment?"
            content="This action cannot be undone."
            triggerContent={<Button className="mt-4">Submit Assessment</Button>}
            onAccept={handleAssessmentSubmit}
          />
        </form>
      );
    } 
    return <></>;
  };

  return <Container className="px-6">{renderSection()}</Container>;
}
