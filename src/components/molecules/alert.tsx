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
};

export function Alert({ title, description, className }: Props) {
  return (
    <ShadcnAlert className={cn(className)}>
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </ShadcnAlert>
  );
}
