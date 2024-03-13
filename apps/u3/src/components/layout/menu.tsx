/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-29 18:44:14
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-10-30 15:02:12
 * @Description: file description
 */
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { ComponentPropsWithRef } from 'react';
import { ReactComponent as LogoIconSvg } from '../common/assets/imgs/logo-icon.svg';
import { getCommunityPath } from '@/route/path';
import { cn } from '@/lib/utils';
import useAllJoinedCommunities from '@/hooks/community/useAllJoinedCommunities';
import { CommunityInfo } from '@/services/community/types/community';

export default function Menu({
  className,
  ...props
}: ComponentPropsWithRef<'div'>) {
  const navigate = useNavigate();
  return (
    <div
      className={cn(
        'bg-[#14171A] w-[60px] h-full px-[10px] py-[20px] box-border flex flex-col gap-[20] items-start',
        className
      )}
      {...props}
    >
      <div
        className="w-[36px] flex flex-col gap-[4px] cursor-pointer max-sm:hidden"
        onClick={() => navigate('/')}
      >
        <LogoIconBox>
          <LogoIconSvg />
        </LogoIconBox>
        <span
          className={
            'w-[fit-content] flex px-[4px] py-[2px] items-center rounded-[22px] bg-[#454C99] text-[#ffffff] text-[10px] font-medium'
          }
        >
          Alpha
        </span>
      </div>
      <hr className="border-t border-[#39424C] my-4 w-full max-sm:hidden" />

      <UserCommunities />
    </div>
  );
}

function UserCommunities() {
  const { joinedCommunities } = useAllJoinedCommunities();
  // TODO : browsingCommunity
  const browsingCommunity = null;
  const showCommunities = [...joinedCommunities];
  if (browsingCommunity?.parent_url) {
    const findCommunity = showCommunities.find(
      (c) => c.id === browsingCommunity.id
    );
    if (!findCommunity) {
      showCommunities.unshift(browsingCommunity);
    }
  }

  return (
    <div className="w-full overflow-scroll h-full flex gap-5 flex-col">
      {showCommunities.map((item) => (
        <CommunityItem communityInfo={item} />
      ))}
    </div>
  );
}

function CommunityItem({ communityInfo }: { communityInfo: CommunityInfo }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => {
        navigate(getCommunityPath(communityInfo.channelId));
      }}
      className="cursor-pointer relative"
    >
      <div className="flex items-center gap-3">
        <img
          src={communityInfo.logo}
          alt={communityInfo.name}
          className="rounded-md w-[40px] h-[40px]"
        />
        <div className="text-white font-bold">{communityInfo.name}</div>
      </div>
    </div>
  );
}

const LogoIconBox = styled.div`
  width: 36px;
  height: 36px;
  path {
    fill: #fff;
  }
`;
