/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-29 18:44:14
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-10-30 15:02:12
 * @Description: file description
 */
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { ComponentPropsWithRef, useMemo, useState } from 'react';
import { ReactComponent as LogoIconSvg } from '../common/assets/imgs/logo-icon.svg';
import { useFarcasterCtx } from '@/contexts/social/FarcasterCtx';
import { getCommunityPath, isCommunityPath } from '@/route/path';
import { cn } from '@/lib/utils';

export default function Menu({
  className,
  ...props
}: ComponentPropsWithRef<'div'>) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isCommunity = isCommunityPath(pathname);
  return (
    <div
      className={cn(
        'bg-[#1b1e23] w-[60px] h-full fixed top-[0] left-[0] px-[10px] py-[20px] box-border flex flex-col gap-[20] items-start',
        'max-sm:hidden',
        className
      )}
      {...props}
    >
      <LogoBox onlyIcon={!isOpen} onClick={() => navigate('/')}>
        <LogoIconBox onlyIcon={!isOpen}>
          <LogoIconSvg />
        </LogoIconBox>
        {isOpen ? (
          <span className={'font-medium text-[24px] text-[#ffffff]'}>
            U3.XYZ
          </span>
        ) : (
          <span
            className={
              'w-[fit-content] flex px-[4px] py-[2px] items-center rounded-[22px] bg-[#454C99] text-[#ffffff] text-[10px] font-medium'
            }
          >
            Alpha
          </span>
        )}
      </LogoBox>
      <hr className="border-t border-[#39424C] my-4 w-full" />

      <UserChannels />
    </div>
  );
}

function UserChannels() {
  const { userChannels, currFid } = useFarcasterCtx();

  if (!currFid) return null;

  return (
    <div className="w-full overflow-scroll h-full flex gap-5 flex-col">
      {userChannels.map(({ parent_url }) => (
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

const LogoBox = styled.div<{ onlyIcon?: boolean }>`
  width: ${({ onlyIcon }) => (onlyIcon ? '36px' : '142px')};
  display: flex;
  flex-direction: ${({ onlyIcon }) => (onlyIcon ? 'column' : 'row')};
  gap: ${({ onlyIcon }) => (onlyIcon ? '4px' : '10px')};
  align-items: 'flex-start';
  transition: all 0.3s ease-out;
  cursor: pointer;
`;
const LogoIconBox = styled.div<{ onlyIcon?: boolean }>`
  width: 36px;
  height: 36px;
  path {
    transition: all 0.3s ease-out;
  }
  ${({ onlyIcon }) =>
    onlyIcon &&
    `path {
      fill: #fff;
    }
  `};
`;
