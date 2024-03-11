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
import { cn } from '@/lib/utils';

type Props = {
  // todo: we'll use this for when we have multiple modals
  _id: string;
  title: string;
  content: string;
  children?: React.ReactNode;
  triggerContent?: React.ReactNode | string;
  onAccept?: () => void;
  acceptText?: string;
  classNames?: {
    dialog?: string;
    trigger?: string;
    content?: string;
    header?: string;
    title?: string;
    description?: string;
    acceptButton?: string;
  };
};

export function Modal({
  _id,
  title,
  content,
  children,
  triggerContent = 'open',
  onAccept,
  acceptText,
  classNames,
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
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger
        onClick={handleOpen}
        asChild={typeof triggerContent !== 'string'}
        className={classNames?.trigger}
      >
        {triggerContent}
      </DialogTrigger>
      <DialogContent className={classNames?.content}>
        <DialogHeader className={classNames?.header}>
          <DialogTitle className={classNames?.title}>{title}</DialogTitle>
          <DialogDescription className={classNames?.dialog}>{content}</DialogDescription>
          {children}
          <Button
            className={cn('md:w-[10rem] mx-auto', classNames?.acceptButton)}
            onClick={handleAccept}
          >
            {acceptText || 'Accept'}
          </Button>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
