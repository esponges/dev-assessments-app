import { InputFile } from '@/components/atoms/input-file';
import { Button } from '@/components/ui/button';
import { Label } from '@radix-ui/react-label';
import { Input } from '@/components/ui/input';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Alert } from '@/components/molecules/alert';
import { Container } from '@/components/layouts/container';

type TechStack = {
  tech: string;
  years_of_experience: number;
};

type MutationResponse = {
  LLMParsedResponse: {
    tech_stack: TechStack[];
  };
};

const onUpload = async (file: File) => {
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
  const [stack, setStack] = useState<TechStack[]>([]);
  const { data, mutate, isPending } = useMutation<MutationResponse, Error, File>(
    {
      mutationFn: onUpload,
      onSuccess: (data) => {
        setStack(data.LLMParsedResponse.tech_stack);
      },
    }
  );

  const handleUpload = async () => {
    if (file) {
      mutate(file);
    }
  };

  const handleTechStackUpdate = (key: string, value: number) => {
    const updatedStack = stack.map((el) => {
      if (el.tech === key) {
        return {
          ...el,
          years_of_experience: value,
        };
      }
      return el;
    });
    setStack(updatedStack);
  };

  return (
    <Container>
      <InputFile
        handleChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setFile(file);
          }
        }}
        className='my-4'
        label='Upload your resume'
      />
      <Label className='my-4'>{file?.name || ''}</Label>
      <Alert
        title='We will analyze your resume'
        description='This will help us to understand your skills and experience.'
        className='my-4'
      />
      <Button
        onClick={handleUpload}
        className='my-4'
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
          <h1 className='text-2xl font-bold my-4'>Stack (years)</h1>
          {stack.map((el, i) => (
            <div
              key={el.tech + i}
              className='grid items-center gap-1.5 my-1 grid-cols-2'
            >
              <Label htmlFor={el.tech}>{el.tech}</Label>
              <Input
                type='number'
                id={el.tech}
                className='max-w-[4rem]'
                value={el.years_of_experience}
                onChange={(e) =>
                  handleTechStackUpdate(el.tech, Number(e.target.value))
                }
              />
            </div>
          ))}
          <Alert
            title='Please confirm the years of experience for each technology'
            description='In case the years of experience are not accurate, please update the values.'
            className='my-4'
          />
          <Button>Confirm</Button>
        </>
      ) : null}
    </Container>
  );
}
