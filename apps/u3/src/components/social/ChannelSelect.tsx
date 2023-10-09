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
import ChannelHome from '../icons/ChannelHome';

export default function ChannelSelect({
  channel,
  selectChannelName,
  setSelectChannelName,
}: {
  channel: Channel;
  selectChannelName: string;
  setSelectChannelName: (name: string) => void;
}) {
  // const [value, setValue] = useState('Home');
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
      selectedKey={selectChannelName}
      onSelectionChange={(k) => {
        setSelectChannelName(k as string);
      }}
      aria-label="Select a channel"
    >
      <ButtonStyled>
        <SelectValue />
        <ArrowDown />
      </ButtonStyled>
      <PopoverStyled>
        <ListBox items={options}>
          {(item) => (
            <ItemStyled id={item.name} textValue={item.name}>
              <div className="item">
                {(item.image && (
                  <span>
                    <img src={item.image} alt={item.name} />
                  </span>
                )) || (
                  <span>
                    <ChannelHome />
                  </span>
                )}
                <span>{item.name}</span>
              </div>
            </ItemStyled>
          )}
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
  width: 100px;
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
  border: none;
  padding: 5px;
  width: 100px;
  border-radius: 4px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  outline: none;
  > span {
    color: #fff;
    font-family: Rubik;
    font-size: 10px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }
  &:disabled {
    cursor: not-allowed;
  }
  .item {
    display: flex;
    align-items: center;
    > span {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 5px;
      > svg {
        width: 12px;
        height: 12px;
      }
      > img {
        width: 12px;
        height: 12px;
      }
    }
  }
`;

const PopoverStyled = styled(Popover)`
  background: #1b1e23;
  border: none;
  width: 100px;
  border-radius: 10px;

  &[data-placement='top'] {
    --origin: translateY(4px);
  }

  &[data-placement='bottom'] {
    --origin: translateY(-4px);
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
  color: #fff;
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
    font-weight: normal;
  }

  [slot='description'] {
    font-size: small;
  }

  .item {
    display: flex;
    align-items: center;
    padding: 5px;
    > span {
      display: flex;
      align-items: center;
      color: #fff;
      font-family: Rubik;
      font-size: 10px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
      margin-right: 5px;
      > svg {
        width: 12px;
        height: 12px;
      }
      > img {
        width: 10px;
        height: 10px;
        margin: 1px;
      }
    }
  }
`;
