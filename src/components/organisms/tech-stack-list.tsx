import { useState } from 'react';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

import type { TechStack } from '@/types';
import { Button } from '../ui/button';

type Props = {
  stack: TechStack;
  setStack: (stack: TechStack) => void;
};

export function TechStackList({ stack, setStack }: Props) {
  const handleTechStackUpdate = (key: string, value: number) => {
    const updatedStack =
      value > 0
        ? stack.map((el) => {
            if (el.tech === key) {
              return {
                ...el,
                experience: value,
              };
            }
            return el;
          })
        : stack.filter((el) => el.tech !== key);

    setStack(updatedStack);
  };

  const handleRemoveTech = (key: string) => {
    handleTechStackUpdate(key, 0);
  };

  const handleAddTech = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { tech, experience } = e.currentTarget;

    if (!tech.value || !experience.value) {
      return;
    }

    const updatedStack = [
      ...stack,
      {
        tech: tech.value,
        experience: Number(experience.value),
      },
    ];

    setStack(updatedStack);
  };

  return (
    <div className='mx-auto'>
      <h1 className='text-2xl font-bold my-4'>Your Stack (years)</h1>
      {stack ? (
        // take full width of all these elements
        <div className='w-full'>
          {stack.map((el, i) => (
            <div
              key={el.tech + i}
              className='grid items-center gap-1.5 my-1 grid-cols-2'
            >
              <Label htmlFor={el.tech}>{el.tech}</Label>
              {/* send to the right */}
              <div className='flex justify-end gap-1.5'>
                <Input
                  type='number'
                  id={el.tech}
                  className='max-w-[4rem]'
                  value={el.experience}
                  onChange={(e) =>
                    handleTechStackUpdate(el.tech, Number(e.target.value))
                  }
                />
                <Button onClick={() => handleRemoveTech(el.tech)}>X</Button>
              </div>
            </div>
          ))}
        </div>
      ) : null}
      {/* add element */}
      <h1 className='text-2xl font-bold my-4'>Add new technology</h1>
      <form
        onSubmit={handleAddTech}
        className='grid items-center gap-1.5 my-1 grid-cols-2'
      >
        <Input type='text' id='tech' placeholder='Technology' />
        <div className='flex justify-end gap-1.5'>
          <Input
            type='number'
            id='experience'
            placeholder='Years'
            className='max-w-[4rem]'
          />
          <Button type='submit'>Add</Button>
        </div>
      </form>
    </div>
  );
}
