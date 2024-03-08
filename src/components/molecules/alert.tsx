import {
  Alert as ShadcnAlert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { cn } from '@/lib/utils';

type Props = {
  title: string;
  description: string;
  classNames?: {
    main?: string;
    title?: string;
    description?: string;
  };
};

export function Alert({ title, description, classNames }: Props) {
  return (
    <ShadcnAlert className={cn(classNames?.main)}>
      <AlertTitle className={cn(classNames?.title)}>{title}</AlertTitle>
      <AlertDescription className={cn(classNames?.description)}>
        {description}
      </AlertDescription>
    </ShadcnAlert>
  );
}
