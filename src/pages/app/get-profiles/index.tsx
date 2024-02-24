import { useState } from 'react';

import { Container } from '@/components/layouts/container';
import { Alert } from '@/components/molecules/alert';
import { Textarea } from '@/components/ui/textarea';

export default function DevProfiles() {
  const [description, setDescription] = useState('');

  return (
    <Container>
      <Alert
        title='What kind of developer are you looking for?'
        description='Briefly describe the kind of developer you are looking for and we will find the best match for you.'
      />
      <Textarea
        placeholder='We are looking for a senior developer with React, Node.js, and MongoDB experience.'
        className='mt-4'
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
    </Container>
  );
}
