import { InputFile } from '@/components/atoms/input-file';
import { Button } from '@/components/ui/button';
import { Label } from '@radix-ui/react-label';
import { useState } from 'react';

export default function AssessProfile() {
  const [file, setFile] = useState<File | null>(null);

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
      {file && <Label className='my-4'>{file.name}</Label>}
      <Button
        onClick={() => {
          if (file) {
            console.log(file);
          }
        }}
        className='my-4'
      >
        Submit
      </Button>
    </main>
  );
}
