import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { Label } from '@/components/ui/label';
import { InputFile } from '@/components/atoms/input-file';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/molecules/alert';
import { Container } from '@/components/layouts/container';

import type { TechStack } from '@/types';
import { TechStackList } from '@/components/organisms/tech-stack-list';

type MutationResponse = {
  LLMParsedResponse: {
    tech_stack: TechStack;
  };
};

const parseResume = async (file: File) => {
  const body = {
    resume: 'file',
    upsert: false,
  };

  const formData = new FormData();

  formData.append('file', file);
  formData.append('body', JSON.stringify(body));

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/candidate/parse_resume`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!res.ok) {
    throw new Error('Network response was not ok');
  }

  const json = await res.json();

  return json;
};

export default function AssessProfile() {
  const [file, setFile] = useState<File | null>(null);
  const [stack, setStack] = useState<TechStack>([]);
  const { mutate, isPending } = useMutation<MutationResponse, Error, File>({
    mutationFn: parseResume,
    onSuccess: (data) => {
      setStack(data.LLMParsedResponse.tech_stack);
    },
  });

  const handleUpload = async () => {
    if (file) {
      mutate(file);
    }
  };

  return (
    <Container className="md:w-1/4 w-3/4">
      <InputFile
        handleChange={(e) => {
          const f = e.target.files?.[0];
          
          if (f) {
            setFile(f);
          }
        }}
        className="my-4"
        label="Upload your resume"
      />
      <Label className="my-4">{file?.name || ''}</Label>
      <Alert
        title="We will analyze your resume"
        description="This will help us to understand your skills and experience."
        className="my-4"
      />
      <Button
        onClick={handleUpload}
        className="my-4"
        disabled={!file || isPending || !!stack.length}
      >
        {!file
          ? 'Please select a file'
          : isPending
          ? 'Analyzing...'
          : 'Analyze'}
      </Button>
      {!!stack.length ? (
        <>
          <TechStackList
            stack={stack}
            setStack={setStack}
          />
          <Alert
            title="Please confirm the years of experience for each technology"
            description="In case the years of experience are not accurate, please update the values."
            className="my-4"
          />
          <Button>Confirm</Button>
        </>
      ) : null}
    </Container>
  );
}
