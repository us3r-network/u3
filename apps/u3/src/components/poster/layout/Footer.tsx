import dayjs from 'dayjs';

export default function Footer({ createAt }: { createAt?: number }) {
  return (
    <div className="w-full flex justify-between text-[#000] text-[12px] font-bold leading-[normal] mt-[20px]">
      <span>
        {createAt
          ? dayjs(createAt).format('MMMM D, YYYY')
          : dayjs().format('MMMM D, YYYY')}
      </span>
      <span>From u3.xyz</span>
    </div>
  );
}
