import { ComponentPropsWithRef } from 'react';
import { FrameFormValues } from './CreateFrameForm';

type Props = ComponentPropsWithRef<'div'> & {
  frame: FrameFormValues;
};
export default function EmbedFramePreview({ frame, ...props }: Props) {
  return (
    <div
      className="
        pb-[20px] box-border flex flex-col items-center self-stretch
        rounded-[10px] border-[1px] border-solid border-[#39424C] bg-[#14171A]
        overflow-hidden
      "
      {...props}
    >
      <img src="" alt="" className="w-full h-[294px]" />
      <div className="w-full p-[20px] box-border [border-top:1px_solid_#39424C]">
        <button
          type="button"
          className="flex w-full h-[40px] box-border justify-center items-center rounded-[10px] bg-[#FFF]"
        >
          Claim
        </button>
      </div>
    </div>
  );
}
