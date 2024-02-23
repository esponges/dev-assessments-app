import { InputFile } from '@/components/atoms/input-file';
import { Button } from '@/components/ui/button';
import { Label } from '@radix-ui/react-label';
import { Input } from '@/components/ui/input';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

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

  return res.json();
};

export default function AssessProfile() {
  const [file, setFile] = useState<File | null>(null);
  const { data, mutate, isPending } = useMutation<typeof testData, Error, File>(
    {
      mutationFn: onUpload,
      onSuccess: (data) => {
        console.log('resolved', data);
      },
    }
  );

  const handleUpload = async () => {
    if (file) {
      await onUpload(file);
    }
  };

  console.log({ data, isPending });

  return (
    <main className='flex min-h-screen flex-col items-center py-12'>
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
      <Button onClick={handleUpload} className='my-4' disabled={!file}>
        {!file ? 'Please select a file' : isPending ? 'Uploading...' : 'Upload'}
      </Button>
      {testData ? (
        <>
          <h1 className='text-2xl font-bold my-4'>Stack</h1>
          {testData.LLMParsedResponse.tech_stack.map((el, i) => (
            <div key={el.tech + i} className='grid w-full max-w-sm items-center gap-1.5 my-1'>
              <Label htmlFor={el.tech}>{el.tech}</Label>
              <Input
                type='number'
                id={el.tech}
                value={el.years_of_experience}
                onChange={(e) => {
                  console.log('e', e.target.value);
                }}
              />
            </div>
          ))}
        </>
      ) : null}
    </main>
  );
}
