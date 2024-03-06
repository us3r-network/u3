/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-29 18:44:14
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-10-30 15:02:12
 * @Description: file description
 */
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { ComponentPropsWithRef, useMemo } from 'react';
import { ReactComponent as LogoIconSvg } from '../common/assets/imgs/logo-icon.svg';
import { useFarcasterCtx } from '@/contexts/social/FarcasterCtx';
import { getCommunityPath } from '@/route/path';
import { cn } from '@/lib/utils';

export default function Menu({
  className,
  ...props
}: ComponentPropsWithRef<'div'>) {
  const navigate = useNavigate();
  return (
    <div
      className={cn(
        'bg-[#1b1e23] w-[60px] h-full px-[10px] py-[20px] box-border flex flex-col gap-[20] items-start',
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

      <UserChannels />
    </div>
  );
}

function UserChannels() {
  const { userChannels, currFid, browsingChannel } = useFarcasterCtx();

  let showChannels = [];
  if (currFid) {
    showChannels = userChannels;
  }
  if (browsingChannel?.parent_url) {
    const findChannel = showChannels.find(
      (c) => c.parent_url === browsingChannel.parent_url
    );
    if (!findChannel) {
      showChannels.unshift(browsingChannel);
    }
  }

  return (
    <div className="w-full overflow-scroll h-full flex gap-5 flex-col">
      {showChannels.map(({ parent_url }) => (
        <ChannelItem parent_url={parent_url} key={parent_url} />
      ))}
    </div>
  );
}

function ChannelItem({ parent_url }: { parent_url: string }) {
  const { getChannelFromUrl } = useFarcasterCtx();
  const navigate = useNavigate();

  const item = useMemo(() => {
    return getChannelFromUrl(parent_url);
  }, [parent_url, getChannelFromUrl]);

  if (!item) return null;

  return (
    <div
      onClick={() => {
        navigate(getCommunityPath(item.channel_id));
      }}
      className="cursor-pointer relative"
    >
      <div className="flex items-center gap-3">
        <img
          src={item.image}
          alt={item.name}
          className="rounded-md w-[40px] h-[40px]"
        />
        <div className="text-white font-bold">{item.name}</div>
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
