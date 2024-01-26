import { getFarcasterMentions } from '@mod-protocol/farcaster';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import { debounce, set } from 'lodash';

import { Input } from '../ui/input';
import SearchIcon from '../common/icons/SearchIcon';
import CloseIcon from '../common/icons/CloseIcon';
import { useFarcasterCtx } from '@/contexts/social/FarcasterCtx';
import ModalContainerFixed from '../common/modal/ModalContainerFixed';
import { farcasterHandleToBioLinkHandle } from '@/utils/profile/biolink';
import { FarcasterChannel } from '@/hooks/social/farcaster/useFarcasterChannel';
import { cn } from '@/lib/utils';
import useDappCollection from '@/hooks/dapp/useDappCollection';
import useLogin from '@/hooks/shared/useLogin';

export const QuickSearchModalName = 'QuickSearchModal';

const MOD_API_URL = 'https://api.modprotocol.org/api';
const getMentions = getFarcasterMentions(MOD_API_URL);

export default function QuickSearchModal({
  openModalName,
  closeModal: closeModalAction,
}: {
  openModalName: string;
  closeModal: () => void;
}) {
  const { walletAddress } = useLogin();
  const quickSearchScrollRef = useRef<HTMLDivElement>(null);
  const quickSearchModalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { trendChannels } = useFarcasterCtx();
  const [searchText, setSearchText] = useState<string>('');
  const [users, setUsers] = useState<
    {
      avatar_url: string;
      display_name: string;
      fid: number;
      username: string;
    }[]
  >([]);
  const [isMouseCtl, setIsMouseCtl] = useState(false);
  const [dapps, setDapps] = useState([]);
  const { dappCollection } = useDappCollection(walletAddress);
  const [channelSearchResult, setChannelSearchResult] = useState<
    FarcasterChannel[]
  >([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const navigate = useNavigate();

  const getUsers = async (text: string) => {
    if (!text) {
      setUsers([]);
      return;
    }
    const data = await getMentions(text);
    setUsers(data);
  };
  const debouncedGetUsers = useCallback(debounce(getUsers, 500), []);

  const onMouseMove = useCallback(() => {
    setIsMouseCtl(true);
  }, []);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!(e instanceof KeyboardEvent)) {
        return false;
      }
      // console.log('KeyboardEvent', e.key, Date.now());
      setIsMouseCtl(false);
      if (e.key === 'Escape') {
        closeModal();
        return true;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const len = channelSearchResult.length + users.length + dapps.length;
        if (len)
          setSelectedIndex((pre) => {
            return (pre + len - 1) % len;
          });
        return true;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const len = channelSearchResult.length + users.length + dapps.length;
        if (len) setSelectedIndex((pre) => (pre + 1) % len);

        return true;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedIndex < channelSearchResult.length) {
          setSearchText('');
          closeModal();
          navigate(
            `/social/channel/${channelSearchResult[selectedIndex].channel_id}`
          );
          return true;
        }
        if (
          users.length > 0 &&
          selectedIndex < channelSearchResult.length + users.length
        ) {
          setSearchText('');
          closeModal();
          navigate(
            `/u/${farcasterHandleToBioLinkHandle(
              users[selectedIndex - channelSearchResult.length].username
            )}`
          );
          return true;
        }
        if (
          dapps.length > 0 &&
          selectedIndex <
            channelSearchResult.length + users.length + dapps.length
        ) {
          setSearchText('');
          const dapp =
            dapps[selectedIndex - channelSearchResult.length - users.length];

          if (dapp) {
            closeModal();
            navigate(`?dappId=${dapp.id}`);
          }
          return true;
        }
        return true;
      }

      return false;
    },
    [channelSearchResult, users, dapps, selectedIndex, setSelectedIndex]
  );

  useEffect(() => {
    const cs = trendChannels
      .filter((channel) => {
        return channel.name.toLowerCase().includes(searchText.toLowerCase());
      })
      .slice(0, 5);
    setChannelSearchResult(cs);
  }, [trendChannels, searchText]);

  useEffect(() => {
    if (!searchText) {
      setDapps(dappCollection.slice(0, 5));
      return;
    }
    const ds = dappCollection.filter((dapp) => {
      return dapp.name.toLowerCase().includes(searchText.toLowerCase());
    });
    setDapps(ds);
  }, [dappCollection, searchText]);

  const closeModal = useCallback(() => {
    closeModalAction();
  }, [closeModalAction]);

  useEffect(() => {
    quickSearchModalRef.current?.addEventListener('mousemove', onMouseMove);
    quickSearchModalRef.current?.addEventListener('keydown', onKeyDown);
    return () => {
      quickSearchModalRef.current?.removeEventListener(
        'mousemove',
        onMouseMove
      );
      quickSearchModalRef.current?.removeEventListener('keydown', onKeyDown);
    };
  }, [onKeyDown]);

  useEffect(() => {
    if (!quickSearchScrollRef.current) return;

    const scrollContainer = quickSearchScrollRef.current;
    const scrollItems = scrollContainer.getElementsByClassName('scroll-item');
    const itemOffsetTop = (scrollItems[selectedIndex] as HTMLElement).offsetTop;
    const itemOffsetHeight = (scrollItems[selectedIndex] as HTMLElement)
      .offsetHeight;

    const itemVisibleTop =
      itemOffsetTop - scrollContainer.scrollTop - scrollContainer.offsetHeight;
    if (itemVisibleTop > 0) {
      scrollContainer.scrollTop += itemVisibleTop;
    }
    const itemVisibleBottom =
      itemOffsetTop - scrollContainer.scrollTop - itemOffsetHeight - 32;

    if (itemVisibleBottom < 0) {
      scrollContainer.scrollTop += itemVisibleBottom;
    }
  }, [selectedIndex]);

  return (
    <ModalContainerFixed
      open={openModalName === QuickSearchModalName}
      closeModal={closeModal}
      onAfterOpen={() => {
        setSearchText('');
        setUsers([]);
        inputRef.current?.focus();
      }}
      zIndex={40}
      className={cn(
        'top-[100px] md:w-[800px] w-full mb-2 box-border overflow-hidden',
        'max-sm:top-[50px]'
      )}
    >
      <div
        ref={quickSearchModalRef}
        className="flex flex-col w-full overflow-hidden text-white p-2 bg-inherit max-h-[600px] overflow-y-auto"
      >
        <div className="flex px-2 pb-2 gap-1 items-center border-b border-[#39424C] z-50">
          <span>
            <SearchIcon className="w-5 h-5" />
          </span>
          <Input
            ref={inputRef}
            placeholder='Search "u3"'
            className="border-none outline-none focus-visible:ring-0"
            value={searchText}
            onChange={(e) => {
              setSelectedIndex(0);
              setSearchText(e.target.value);
              debouncedGetUsers(e.target.value);
            }}
          />
          <span onClick={closeModal} className="cursor-pointer p-1">
            <CloseIcon className="w-5 h-5" />
          </span>
        </div>
        <div
          id="quick-search-scroll"
          ref={quickSearchScrollRef}
          className={cn(
            ' overflow-scroll max-h-[calc(100vh-160px)] overflow-y-auto flex-grow bg-inherit',
            'max-sm:max-h-[calc(100vh-200px)]'
          )}
        >
          <h3 className="font-light italic p-2 pb-0 sticky top-[0px] z-40 w-full bg-inherit">
            Topics
          </h3>
          {(searchText && channelSearchResult.length === 0 && (
            <div className="text-center text-[#718096] p-2">
              No result fount
            </div>
          )) ||
            channelSearchResult.map((channel, idx) => {
              return (
                <div
                  className={cn(
                    'scroll-item',
                    'flex items-center gap-3 w-full cursor-pointer p-2  rounded-md',
                    idx === selectedIndex && 'bg-gray-700'
                  )}
                  key={channel.channel_id}
                  onClick={() => {
                    setSearchText('');
                    closeModal();
                    navigate(`/social/channel/${channel.channel_id}`);
                  }}
                  onMouseEnter={() => {
                    if (isMouseCtl) setSelectedIndex(idx);
                  }}
                >
                  <img
                    src={channel.image}
                    className="w-8 h-8 rounded-full"
                    alt="channel"
                  />
                  <div className="font-semibold">{channel.name}</div>
                  <div className="text-[#718096] text-sm">
                    {channel.count} new posts
                  </div>
                </div>
              );
            })}

          <hr className="border-[#39424C] py-1 mt-2" />

          <h3 className="font-light italic p-2 pb-1 sticky top-[0px] z-40 w-full bg-inherit">
            Users
          </h3>

          {(searchText && users.length === 0 && (
            <div className="text-center text-[#718096] p-2">
              No result fount
            </div>
          )) ||
            users.map((user, idx) => {
              const sIdx = idx + channelSearchResult.length;
              return (
                <div
                  className={cn(
                    'scroll-item',
                    'flex items-center gap-3 w-full cursor-pointer p-2 rounded-md',
                    sIdx === selectedIndex && 'bg-gray-700'
                  )}
                  key={user.fid}
                  onClick={() => {
                    setSearchText('');
                    closeModal();
                    navigate(
                      `/u/${farcasterHandleToBioLinkHandle(user.username)}`
                    );
                  }}
                  onMouseEnter={() => {
                    if (isMouseCtl) setSelectedIndex(sIdx);
                  }}
                >
                  <img
                    src={user.avatar_url}
                    className="w-8 h-8 rounded-full"
                    alt="channel"
                  />
                  <div className="font-semibold">
                    {user.display_name}
                    <span className="text-[#718096] text-sm">
                      @{user.username}
                    </span>
                  </div>
                </div>
              );
            })}

          <hr className="border-[#39424C] py-1 mt-2" />

          <h3 className="font-light italic p-2 pb-1 sticky top-[0px] z-40 w-full bg-inherit">
            Dapps
          </h3>

          {(searchText && dapps.length === 0 && (
            <div className="text-center text-[#718096] p-2">
              No result fount
            </div>
          )) ||
            dapps.map((dapp, idx) => {
              const sIdx = idx + channelSearchResult.length + users.length;
              return (
                <div
                  key={dapp.id}
                  className={cn(
                    'scroll-item',
                    'flex items-center gap-3 w-full cursor-pointer p-2 rounded-md',
                    sIdx === selectedIndex && 'bg-gray-700'
                  )}
                  onClick={() => {
                    setSearchText('');
                    closeModal();
                    navigate(`?dappId=${dapp.id}`);
                  }}
                  onMouseEnter={() => {
                    if (isMouseCtl) setSelectedIndex(sIdx);
                  }}
                >
                  <img
                    src={dapp.image}
                    className="w-8 h-8 rounded-full"
                    alt="channel"
                  />
                  <div className="font-semibold">{dapp.name}</div>
                  <div className="text-[#718096] text-sm overflow-hidden whitespace-nowrap text-ellipsis">
                    {dapp.description}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </ModalContainerFixed>
  );
}
