import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';

import { Button } from '../ui/button';

type Props = {
  // todo: we'll use this for when we have multiple modals
  _id: string;
  title: string;
  content: string;
  children?: React.ReactNode;
  triggerContent?: React.ReactNode | string;
  onAccept?: () => void;
};

export function Modal({
  _id,
  title,
  content,
  children,
  triggerContent = 'open',
  onAccept,
}: Props) {
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
    <Dialog open={open}>
      <DialogTrigger
        onClick={handleOpen}
        asChild={typeof triggerContent !== 'string'}
      >
        {triggerContent}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{content}</DialogDescription>
          {children}
          <Button onClick={handleAccept}>Accept</Button>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
