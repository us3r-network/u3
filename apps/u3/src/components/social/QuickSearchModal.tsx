import { getFarcasterMentions } from '@mod-protocol/farcaster';
import { useNavigate } from 'react-router-dom';
import { useCallback, useMemo, useRef, useState } from 'react';
import { debounce } from 'lodash';

import { Input } from '../ui/input';
import SearchIcon from '../common/icons/SearchIcon';
import CloseIcon from '../common/icons/CloseIcon';
import { useFarcasterCtx } from '@/contexts/social/FarcasterCtx';
import ModalContainerFixed from '../common/modal/ModalContainerFixed';
import { farcasterHandleToBioLinkHandle } from '@/utils/profile/biolink';

export const QuickSearchModalName = 'QuickSearchModal';

const MOD_API_URL = 'https://api.modprotocol.org/api';
const getMentions = getFarcasterMentions(MOD_API_URL);

export default function QuickSearchModal({
  openModalName,
  closeModal,
}: {
  openModalName: string;
  closeModal: () => void;
}) {
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
  const navigate = useNavigate();

  const getUsers = async (text: string) => {
    console.log('getUsers', text);
    if (!text) {
      setUsers([]);
      return;
    }
    const data = await getMentions(text);
    setUsers(data);
  };
  const debouncedGetUsers = useCallback(debounce(getUsers, 500), []);

  const channelSearchResult = useMemo(() => {
    return trendChannels
      .filter((channel) => {
        return channel.name.toLowerCase().includes(searchText.toLowerCase());
      })
      .slice(0, 5);
  }, [searchText, trendChannels]);

  return (
    <ModalContainerFixed
      open={openModalName === QuickSearchModalName}
      closeModal={closeModal}
      onAfterOpen={() => {
        inputRef.current?.focus();
      }}
      zIndex={40}
      className="top-[100px] md:w-[800px] w-full max-h-[600px] mb-2 box-border overflow-hidden"
    >
      <div className="flex flex-col w-full overflow-hidden text-white p-2 bg-inherit">
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
              setSearchText(e.target.value);
              debouncedGetUsers(e.target.value);
            }}
          />
          <span onClick={closeModal} className="cursor-pointer p-1">
            <CloseIcon className="w-5 h-5" />
          </span>
        </div>
        <div className=" overflow-scroll max-h-[calc(100vh-160px)] overflow-y-auto flex-grow bg-inherit">
          <h3 className="font-light italic p-2 pb-0 sticky top-[0px] z-40 w-full bg-inherit">
            Topics
          </h3>
          <div className="space-y-1 mt-2 w-full">
            {(searchText && channelSearchResult.length === 0 && (
              <div className="text-center text-[#718096] p-2">
                No result fount
              </div>
            )) ||
              channelSearchResult.map((channel) => {
                return (
                  <div
                    className="flex items-center gap-3 w-full cursor-pointer p-2 hover:bg-gray-700 rounded-md"
                    key={channel.channel_id}
                    onClick={() => {
                      setSearchText('');
                      closeModal();
                      navigate(`/social/channel/${channel.channel_id}`);
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
          </div>
          <h3 className="font-light italic p-2 pb-1 sticky top-[0px] z-40 w-full bg-inherit">
            Users
          </h3>
          <div className="space-y-1 mt-2 w-full">
            {(searchText && users.length === 0 && (
              <div className="text-center text-[#718096] p-2">
                No result fount
              </div>
            )) ||
              users.map((user) => {
                return (
                  <div
                    className="flex items-center gap-3 w-full cursor-pointer p-2 hover:bg-gray-700 rounded-md"
                    key={user.fid}
                    onClick={() => {
                      setSearchText('');
                      closeModal();
                      navigate(
                        `/u/${farcasterHandleToBioLinkHandle(user.username)}`
                      );
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
          </div>
        </div>
      </div>
    </ModalContainerFixed>
  );
}
