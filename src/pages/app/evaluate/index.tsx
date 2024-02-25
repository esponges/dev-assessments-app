import { useRouter } from 'next/router';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useState } from 'react';

type DevDetails = {
  id: string;
  resume: string;
  techStack: string[];
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
  id: string;
  stack: string[];
  level: string;
  numberOfQuestion: number;
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

const generateAssessment = async ({
  id,
  stack,
  level,
  numberOfQuestion,
}: MutationVariables) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/assessment/create`,
    {
      method: 'POST',
      body: JSON.stringify({
        id,
        stack,
        level,
        number_of_questions: numberOfQuestion,
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

  // todo: this might be done elsewhere, probably when the page is loaded and the
  // candidate is authenticated
  const { data, isLoading } = useQuery<DevDetails>({
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
    onSuccess: (data) => {
      setAssessment(data);
    },
  });

  const handleGenerateAssessment = async () => {
    const level = 'junior';
    // this is hardcoded for the moment
    // we'll need a way to get a proper level from the user or figure it out
    // based on the candidate's experience, financial aspirations, etc.

    const number_of_questions = 10;
    // this is hardcoded for the moment too

    if (data) {
      await generateAssessment({
        id: data.id,
        stack: data.techStack,
        level,
        numberOfQuestion: number_of_questions,
      });
    }
  };

  return (
    <div>
      <h1>Evaluate</h1>
      <h2>Dev details</h2>
      {isLoading && <p>Loading...</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      <button onClick={handleGenerateAssessment}>Generate assessment</button>
      {assessment && <pre>{JSON.stringify(assessment, null, 2)}</pre>}
    </div>
  );
}
