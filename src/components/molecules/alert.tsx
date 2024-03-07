import {
  Alert as ShadcnAlert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { cn } from '@/lib/utils';

type Props = {
  title: string;
  description: string;
  className?: string;
  disabledElements?: {
    title?: boolean;
    description?: boolean;
  };
};

export function Alert({
  title,
  description,
  className,
  disabledElements,
}: Props) {
  return (
    <ShadcnAlert className={cn(className)}>
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription
        className={cn(disabledElements?.description ? 'disable-highlight' : '')}
      >
        {description}
      </AlertDescription>
    </ShadcnAlert>
  );
}
