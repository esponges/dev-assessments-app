import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type Props = {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  htmlFor?: string;
  id?: string;
  label?: string;
  className?: string;
};

export function InputFile({ handleChange, htmlFor='file', id='file', label = 'File', className }: Props) {
  return (
    <div className={cn('grid w-full max-w-sm items-center gap-1.5', className)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      <Input id={id} type='file' onChange={handleChange} className='hover:cursor-pointer' />
    </div>
  );
}
