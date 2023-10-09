import { useMemo, useState } from 'react';
import { Channel } from 'src/services/types/farcaster';
import styled from 'styled-components';
import {
  Button,
  Item,
  ListBox,
  Popover,
  Select,
  SelectValue,
} from 'react-aria-components';
import ArrowDown from '../icons/ArrowDown';

export default function ChannelSelect({ channel }: { channel: Channel }) {
  const [value, setValue] = useState('Home');
  const options = useMemo(() => {
    return [
      {
        name: 'Home',
        image: '',
      },
      {
        name: channel.name || channel.channel_description,
        image: channel.image,
      },
    ];
  }, [channel]);
  return (
    <SelectStyled
      selectedKey={value}
      onSelectionChange={(k) => {
        console.log(k);
        setValue(k as string);
      }}
      aria-label="Select a channel"
    >
      <ButtonStyled>
        <SelectValue />
        <ArrowDown />
      </ButtonStyled>
      <PopoverStyled>
        <ListBox items={options}>
          {(item) => <ItemStyled id={item.name}>{item.name}</ItemStyled>}
        </ListBox>
      </PopoverStyled>
    </SelectStyled>
  );
}

const SelectStyled = styled(Select)`
  display: flex;
  flex-direction: column;
  position: relative;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  position: relative;
  > span {
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    margin-bottom: 8px;
  }
`;

const ButtonStyled = styled(Button)`
  background: #1a1e23;
  cursor: pointer;
  border: 1px solid #39424c;
  border-radius: 12px;
  padding: 0px 14px 0px 16px;
  height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  outline: none;
  > span {
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;

    color: #ffffff;
  }
  &:disabled {
    cursor: not-allowed;
  }
`;

const PopoverStyled = styled(Popover)`
  background: #1b1e23;
  border: 1px solid #39424c;
  width: 100px;
  border-radius: 10px;

  &[data-placement='top'] {
    --origin: translateY(8px);
  }

  &[data-placement='bottom'] {
    --origin: translateY(-8px);
  }

  &[data-entering] {
    animation: slide 200ms;
  }

  &[data-exiting] {
    animation: slide 200ms reverse ease-in;
  }

  @keyframes slide {
    from {
      transform: var(--origin);
      opacity: 0;
    }

    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const ItemStyled = styled(Item)`
  margin: 0px;
  padding: 15px 20px;
  border-radius: 6px;
  outline: none;
  cursor: default;
  position: relative;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  border-radius: 20px;

  &[aria-selected='true'] {
    font-weight: 600;
  }

  &[data-focused],
  &[data-pressed] {
    background: #14171a;
  }

  [slot='label'] {
    font-weight: bold;
  }

  [slot='description'] {
    font-size: small;
  }
`;
