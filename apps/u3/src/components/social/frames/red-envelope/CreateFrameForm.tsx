import { ComponentPropsWithRef } from 'react';
import { toast } from 'react-toastify';
// import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { CreateRedEnvelopeParams } from '@/services/frames/api/red-envelope';

export const constraintsOptions = [
  {
    value: 'Follow',
    label: 'Follow',
  },
  {
    value: 'Like',
    label: 'Like',
  },
  {
    value: 'Repost',
    label: 'Repost',
  },
];

export const defaultFrameFormValues: CreateRedEnvelopeParams = {
  description: 'Red envelope',
  randomFrom: 1,
  randomTo: 1,
  totalAmount: 1,
  txHash: '',
};

export type CreateFrameFormProps = ComponentPropsWithRef<'form'> & {
  values: CreateRedEnvelopeParams;
  submitting?: boolean;
  disabled?: boolean;
  onValuesChange: (values: CreateRedEnvelopeParams) => void;
  onSubmit: (values: CreateRedEnvelopeParams) => void;
};

export default function CreateFrameForm({
  values,
  submitting,
  disabled,
  onValuesChange,
  onSubmit,
  className,
  ...props
}: CreateFrameFormProps) {
  const { randomFrom, randomTo, totalAmount } = values;
  // const constraintsOptionsEl = constraintsOptions.map(({ value, label }) => (
  //   <div key={value} className="flex items-center gap-[10px] cursor-pointer">
  //     <Checkbox
  //       id={`constraints-${value}`}
  //       className="border border-white"
  //       checked={constraints.includes(value)}
  //       disabled={disabled}
  //       onCheckedChange={(v) => {
  //         if (v) {
  //           onValuesChange({ ...values, constraints: [...constraints, value] });
  //         } else {
  //           onValuesChange({
  //             ...values,
  //             constraints: constraints.filter((c) => c !== value),
  //           });
  //         }
  //       }}
  //     />
  //     <label
  //       htmlFor={`constraints-${value}`}
  //       className="text-[#FFF] text-[16px] font-normal cursor-pointer"
  //     >
  //       {label}
  //     </label>
  //   </div>
  // ));
  return (
    <form
      className={cn('w-full flex flex-col gap-[30px]', className)}
      {...props}
    >
      <div className="flex items-center gap-[20px]">
        <span className="text-[#718096] text-[14px] font-medium">
          Constraints
        </span>
        <div className="flex items-center gap-[20px]">
          {/* {constraintsOptionsEl} */}
          <span className="text-[#FFF] text-[16px] font-normal">
            Follow & Like & Repost
          </span>
        </div>
      </div>
      <div className="flex items-center gap-[20px]">
        <span className="text-[#718096] text-[14px] font-medium">
          Random interval
        </span>
        <div className="flex-1 flex items-center gap-[20px]">
          <div className="flex-1 h-[40px] flex flex-grow items-center border border-[#39424C] rounded-full px-3">
            <input
              type="number"
              className="w-full p-1 px-2 text-white bg-[#1B1E23] outline-none"
              value={randomFrom}
              disabled={disabled}
              onChange={(e) => {
                onValuesChange({ ...values, randomFrom: +e.target.value });
              }}
            />
            <span className="text-[#FFF] text-[16px] font-medium">$DEGEN</span>
          </div>
          <div className="text-[#718096] text-[16px] font-medium">—</div>
          <div className="flex-1 h-[40px] flex flex-grow items-center border border-[#39424C] rounded-full px-3">
            <input
              type="number"
              className="w-full p-1 px-2 text-white bg-[#1B1E23] outline-none"
              value={randomTo}
              disabled={disabled}
              onChange={(e) => {
                onValuesChange({ ...values, randomTo: +e.target.value });
              }}
            />
            <span className="text-[#FFF] text-[16px] font-medium">$DEGEN</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-[20px]">
        <span className="text-[#718096] text-[14px] font-medium">Reward</span>
        <div className="flex-1 flex items-center gap-[20px]">
          <div className="flex-1 flex flex-grow items-center border border-[#39424C] rounded-full px-3">
            <input
              type="number"
              className="w-full h-[40px] p-1 px-2 text-white bg-[#1B1E23] outline-none"
              value={totalAmount}
              disabled={disabled}
              onChange={(e) => {
                onValuesChange({ ...values, totalAmount: +e.target.value });
              }}
            />
            <span className="text-[#FFF] text-[16px] font-medium">$DEGEN</span>
          </div>
          <button
            type="button"
            className="
            flex px-[12px] py-[6px] h-[40px] justify-center items-center rounded-[10px] bg-[#F41F4C]
            text-[#FFF] text-center text-[12px] font-normal leading-[20px]
            "
            disabled={disabled}
            onClick={() => {
              // if (constraints.length === 0) {
              //   toast.error('Please select at least one constraint');
              //   return;
              // }
              if (randomFrom === 0 || randomTo === 0) {
                toast.error('Reward must be greater than 0');
                return;
              }
              if (randomFrom > randomTo) {
                toast.error('Min reward must be less than max reward');
                return;
              }
              if (totalAmount === 0) {
                toast.error('Total reward must be greater than 0');
                return;
              }
              if (totalAmount < randomTo) {
                toast.error('Total reward must be greater than max reward');
                return;
              }

              onSubmit(values);
            }}
          >
            {submitting ? 'Submitting...' : 'Pledge'}
          </button>
        </div>
      </div>
    </form>
  );
}
