import { useMemo, useState } from 'react';
import styled from 'styled-components';
import {
  Button,
  Item,
  ListBox,
  Popover,
  Select,
  SelectValue,
} from 'react-aria-components';
import ArrowDown from '../common/icons/ArrowDown';
import { getChannel } from '../../utils/social/farcaster/getChannel';

export default function ChannelSelect({
  selectChannelId,
  setSelectChannelId,
}: {
  selectChannelId: string;
  setSelectChannelId: (id: string) => void;
}) {
  const [value, setValue] = useState('');
  const options = useMemo(() => {
    return [
      {
        name: 'Home',
        channel_id: 'Home',
        image: '/social/imgs/channel-home.png',
      },
      ...getChannel().map((c) => ({
        name: c.name,
        channel_id: c.channel_id,
        image: c.image,
      })),
    ].filter((c) => {
      return c.name.toLowerCase().includes(value.toLowerCase());
    });
  }, [value]);

  const channel = useMemo(() => {
    return options.find((c) => c.channel_id === selectChannelId);
  }, [options, selectChannelId]);

  return (
    <SelectStyled
      selectedKey={channel?.channel_id || 'Home'}
      onSelectionChange={(k) => {
        setSelectChannelId(k as string);
        setValue('');
      }}
      aria-label="SelectStyled"
    >
      <ButtonStyled>
        <SelectValue />
        <ArrowDown />
      </ButtonStyled>
      <PopoverStyled>
        <input
          type="text"
          placeholder="search for trends"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
        />
        <ListBox items={options}>
          {(item) => (
            <ItemStyled id={item.channel_id} textValue={item.name}>
              <div className="item">
                <span>#</span>
                <span>
                  <img src={item.image} alt={item.name} />
                </span>
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
  width: 130px;
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
  width: 130px;
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
        border-radius: 2px;
      }
    }
  }
`;

const PopoverStyled = styled(Popover)`
  background: #1b1e23;
  border: none;
  width: 130px;
  border-radius: 10px;
  overflow: scroll;
  margin-top: 3px;
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

  input {
    background-color: inherit;
    border: none;
    outline: none;
    font-size: 13px;
    padding: 5px;
    width: 100%;
    box-sizing: border-box;
    caret-color: #fff;
    color: #fff;
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
        border-radius: 2px;
      }
    }
  }
`;
