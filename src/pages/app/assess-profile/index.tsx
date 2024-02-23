import { InputFile } from '@/components/atoms/input-file';
import { Button } from '@/components/ui/button';
import { Label } from '@radix-ui/react-label';
import { Input } from '@/components/ui/input';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Alert } from '@/components/molecules/alert';

export const dynamic = 'force-dynamic';

const testData = {
  LLMParsedResponse: {
    tech_stack: [
      {
        tech: 'Vue.js',
        years_of_experience: 5,
      },
      {
        tech: 'Vuex',
        years_of_experience: 5,
      },
      {
        tech: 'Nuxt.js',
        years_of_experience: 5,
      },
      {
        tech: 'JavaScript ES6',
        years_of_experience: 5,
      },
      {
        tech: 'HTML5',
        years_of_experience: 5,
      },
      {
        tech: 'CSS3',
        years_of_experience: 5,
      },
      {
        tech: 'SASS',
        years_of_experience: 5,
      },
      {
        tech: 'Node.js',
        years_of_experience: 5,
      },
      {
        tech: 'Express',
        years_of_experience: 5,
      },
      {
        tech: 'MongoDB',
        years_of_experience: 5,
      },
      {
        tech: 'MySQL',
        years_of_experience: 5,
      },
      {
        tech: 'Docker',
        years_of_experience: 5,
      },
      {
        tech: 'Nginx',
        years_of_experience: 5,
      },
      {
        tech: 'AWS',
        years_of_experience: 5,
      },
      {
        tech: 'Python',
        years_of_experience: 8,
      },
      {
        tech: 'Django',
        years_of_experience: 8,
      },
      {
        tech: 'Flask',
        years_of_experience: 8,
      },
      {
        tech: 'Ruby on Rails',
        years_of_experience: 8,
      },
      {
        tech: 'RESTful APIs',
        years_of_experience: 8,
      },
      {
        tech: 'GraphQL',
        years_of_experience: 8,
      },
      {
        tech: 'Java',
        years_of_experience: 8,
      },
      {
        tech: 'SpringBoot',
        years_of_experience: 8,
      },
      {
        tech: 'Kafka',
        years_of_experience: 8,
      },
      {
        tech: 'Redis',
        years_of_experience: 8,
      },
      {
        tech: 'Elasticsearch',
        years_of_experience: 8,
      },
      {
        tech: 'Celery',
        years_of_experience: 8,
      },
      {
        tech: 'RabbitMQ',
        years_of_experience: 8,
      },
      {
        tech: 'Docker',
        years_of_experience: 8,
      },
      {
        tech: 'Kubernetes',
        years_of_experience: 8,
      },
    ],
  },
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
  const { data, mutate, isPending } = useMutation<typeof testData, Error, File>(
    {
      mutationFn: onUpload,
    }
  );

  const handleUpload = async () => {
    if (file) {
      mutate(file);
    }
  };

  return (
    <main className='flex min-h-screen flex-col items-center py-12 w-1/4 mx-auto'>
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
      <Button
        onClick={handleUpload}
        className='my-4'
        disabled={!file || isPending}
      >
        {!file ? 'Please select a file' : isPending ? 'Uploading...' : 'Upload'}
      </Button>
      {testData ? (
        <>
          <h1 className='text-2xl font-bold my-4'>Stack (years)</h1>
          {testData.LLMParsedResponse.tech_stack.map((el, i) => (
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
                onChange={(e) => {
                  console.log('e', e.target.value);
                }}
              />
            </div>
          ))}
          <Alert
            title='Please confirm the years of experience for each technology'
            description='The years of experience for each technology is required to proceed'
            className='my-4'
          />
          <Button>Confirm</Button>
        </>
      ) : null}
    </main>
  );
}
