import { useOutletContext } from 'react-router-dom';

export default function PostsFcMentionedLinks() {
  const communityContext = useOutletContext<any>();
  // 可以在这个组件根据这个channelId查询，也可以在上层context里查询，数据从communityContext里传递下来
  // 可参考MembersLayout 里的 TotalMembers 组件
  const { channelId } = communityContext;
  console.log('channelId', channelId);

  return (
    <div className="w-full h-full overflow-auto">
      <div className="text-[#fff] text-[16px] mt-[20px] text-center">
        Comming soon
      </div>
    </div>
  );
}
