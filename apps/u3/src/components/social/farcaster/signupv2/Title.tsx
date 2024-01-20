import Checked from '@/components/common/icons/checked';
import Unchecked from '@/components/common/icons/unchecked';
import { cn } from '@/lib/utils';

export default function Title({
  checked,
  text,
}: {
  checked: boolean;
  text: string;
}) {
  return (
    <div className="flex gap-5 items-center">
      {checked ? <Checked /> : <Unchecked />}
      <h1
        className={cn(
          'text-3xl italic font-bold text-transparent pr-5',
          'bg-gradient-to-r from-[#cd62ff] to-[#62aaff]',
          'bg-clip-text'
        )}
      >
        {text}
      </h1>
    </div>
  );
}
