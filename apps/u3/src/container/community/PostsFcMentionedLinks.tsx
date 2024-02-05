import { useOutletContext } from 'react-router-dom';

export default function PostsFcMentionedLinks() {
  const communityContext = useOutletContext<any>();
  return (
    <div className="w-full h-full overflow-auto">
      <div className="text-[#fff] text-[16px] mt-[20px] text-center">
        Comming soon
      </div>
    </div>
  );
}
