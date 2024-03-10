import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { Inter as FontSans } from 'next/font/google';

import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

type Props = {
  id: string;
  title: string;
  content: string;
  children?: React.ReactNode;
  onAccept?: () => void;
};

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});


export function Modal({ id, title, content, children, onAccept }: Props) {
  const [open, setOpen] = useState(false);

  const handleAccept = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    if (onAccept) onAccept();
  };

  const handleOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(true);
  };

  return (
    <span
      className={cn(
        // 'min-h-screen bg-background font-sans antialiased',
        'foo',
        fontSans.variable
      )}
    >
      <Dialog open={open}>
        <DialogTrigger onClick={handleOpen}>open</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{content}</DialogDescription>
            {children}
            <Button onClick={handleAccept}>Accept</Button>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </span>
  );
}
