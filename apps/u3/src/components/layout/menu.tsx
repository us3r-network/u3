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
import { cn } from '@/lib/utils';
import useAllJoinedCommunities from '@/hooks/community/useAllJoinedCommunities';
import useBrowsingCommunity from '@/hooks/community/useBrowsingCommunity';
import SidebarCommunityItem from '../community/SidebarCommunityItem';
import ExploreIcon from './nav-icons/ExploreIcon';
import useRoute from '@/route/useRoute';
import { RouteKey } from '@/route/routes';
import LoginButtonV2 from './LoginButtonV2';

export default function Menu({
  className,
  ...props
}: ComponentPropsWithRef<'div'>) {
  return (
    <div
      className={cn(
        'bg-[#14171A] w-[60px] h-full py-[20px] box-border flex flex-col gap-[20] items-start',
        className
      )}
      {...props}
    >
      <div className="w-full flex flex-col items-center gap-[4px] cursor-pointer max-sm:hidden">
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
      <SidebarHomeLink />
      <UserCommunities />
      <hr className="border-t border-[#39424C] my-4 w-full max-sm:hidden" />
      <div className="w-full max-sm:hidden">
        <LoginButtonV2 />
      </div>
    </div>
  );
}

function SidebarHomeLink() {
  const navigate = useNavigate();
  const { firstRouteMeta } = useRoute();
  const firstRouteKey = firstRouteMeta?.key;
  const active = firstRouteKey === RouteKey.home;
  return (
    <a
      href={'/'}
      onClick={(e) => {
        e.preventDefault();
        navigate('/');
      }}
      className="w-full flex justify-center items-center cursor-pointer relative mb-[20px] max-sm:hidden"
    >
      <div
        className={cn(
          'w-[5px] h-[40px] rounded-tl-none rounded-br-[10px] rounded-tr-[10px] rounded-bl-none bg-[#FFF] absolute left-0',
          'transition-all duration-300',
          active ? 'block' : 'hidden'
        )}
      />
      <div className="flex w-[39px] h-[39px] justify-center items-center gap-[10px] rounded-[10px] bg-[#F41F4C]">
        <ExploreIcon active />
      </div>
    </a>
  );
}

function UserCommunities() {
  const { joinedCommunities } = useAllJoinedCommunities();
  const { browsingCommunity } = useBrowsingCommunity();
  const showCommunities = [...joinedCommunities];
  if (browsingCommunity) {
    const findCommunity = showCommunities.find(
      (c) => c.id === browsingCommunity.id
    );
    if (!findCommunity) {
      showCommunities.unshift(browsingCommunity);
    }
  }

  return (
    <div className="flex-1 w-full overflow-scroll flex gap-5 flex-col">
      {showCommunities.map((item) => (
        <SidebarCommunityItem
          key={item.id}
          communityInfo={item}
          active={browsingCommunity?.id === item.id}
        />
      ))}
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
