/* eslint-disable react/destructuring-assignment */
import { useCallback, useEffect, useState } from 'react';
import { Channel } from '@mod-protocol/farcaster';
import { CaretDownIcon } from '@radix-ui/react-icons';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { Button } from '@/components/ui/button';
import { useFarcasterCtx } from '@/contexts/social/FarcasterCtx';
import { cn } from '@/lib/utils';

export function FCastChannelPicker({
  channelSelected,
  setChannelSelected,
}: {
  channelSelected: Channel;
  setChannelSelected: (channel: Channel) => void;
}) {
  const { farcasterChannels } = useFarcasterCtx();
  const [open, setOpen] = useState(false);

  const [channelResults, setChannelResults] = useState<Channel[]>([]);

  useEffect(() => {
    setChannelResults(farcasterChannels);
  }, [farcasterChannels]);

  const handleSelect = useCallback(
    (channel: Channel) => {
      setOpen(false);
      setChannelSelected(channel);
    },
    [setChannelSelected, setOpen]
  );

  // console.log(farcasterChannels);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          type="button"
          className={cn(
            'border-none px-6',
            'bg-[#14171A] hover:bg-[#14171A] focus:bg-[#14171A]',
            'hover:text-white focus:text-white text-white'
          )}
        >
          <img
            src={channelSelected.image ?? ''}
            alt={channelSelected.name}
            className="mr-2 -ml-2 h-5 w-5"
          />
          {channelSelected.name}
          <CaretDownIcon className="-mr-2 ml-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn('w-[400px] p-0', 'bg-black border-none')}
        align="start"
      >
        <Command className="bg-black hover:bg-black focus:bg-black">
          <CommandInput
            placeholder="Search Channels"
            // value={query}
            // onValueChange={(e) => setQuery(e)}
            className="text-white"
          />
          <CommandEmpty className="py-6 text-center text-sm text-white">
            No Channel found.
          </CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-y-auto">
            {(channelResults.length === 0
              ? [channelSelected]
              : channelResults
            ).map((channel) => (
              <CommandItem
                key={channel.parent_url || 'home'}
                value={channel.name || 'home'}
                className={cn(
                  'cursor-pointer text-white hover:bg-[#14171A] focus:bg-[#14171A]',
                  'aria-selected:bg-[#14171A] aria-selected:text-white'
                )}
                onSelect={() => handleSelect(channel)}
              >
                <img
                  src={channel.image ?? ''}
                  alt={channel.name}
                  width={24}
                  height={24}
                  className="mr-2"
                />
                {channel.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
