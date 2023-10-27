import styled from 'styled-components';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronDown } from '../../common/icons/chevron-down';

export function DropDown({
  width,
  items,
  Icon,
  title,
  defaultSelect,
  selectAction,
}: {
  items: string[];
  Icon?: React.ReactNode;
  width?: number;
  title?: string;
  defaultSelect?: string;
  selectAction?: (item: string) => void;
}) {
  const titleRef = useRef();
  const [showList, setShowList] = useState(false);
  const [select, setSelect] = useState('');

  const updateSelect = useCallback(
    (item: string) => {
      setSelect(item);
      setShowList(false);
      if (item !== select && selectAction) selectAction(item);
    },
    [select]
  );

  useEffect(() => {
    const windowClick = (e: MouseEvent) => {
      if (
        e.target === titleRef.current ||
        (e.target as HTMLElement).parentNode === titleRef.current
      )
        return;
      setShowList(false);
    };
    window.addEventListener('click', windowClick);
    return () => {
      window.removeEventListener('click', windowClick);
    };
  }, []);

  return (
    <DropDownBox width={width ?? 130}>
      <div
        className="title"
        ref={titleRef}
        onClick={() => {
          setShowList(!showList);
        }}
      >
        {Icon}
        <span>{select || title}</span>
        <ChevronDown />
      </div>
      {showList && (
        <div className="lists">
          {defaultSelect && (
            <div
              className={select === defaultSelect ? 'active' : ''}
              onClick={() => {
                updateSelect(defaultSelect);
              }}
            >
              {defaultSelect}
            </div>
          )}
          {items.map((item) => {
            return (
              <div
                className={select === item ? 'active' : ''}
                key={item}
                onClick={() => {
                  updateSelect(item);
                }}
              >
                {item}
              </div>
            );
          })}
        </div>
      )}
    </DropDownBox>
  );
}

const DropDownBox = styled.div<{ width: number }>`
  display: inline-block;
  position: relative;
  height: 40px;
  width: ${(props) => props.width}px;
  cursor: pointer;
  .title {
    height: inherit;
    display: flex;
    align-items: center;
    border: 1px solid;
    box-sizing: border-box;

    height: 40px;

    background: #1a1e23;

    border: 1px solid #39424c;
    border-radius: 100px;
    padding: 5px;
    display: flex;
    justify-content: space-around;

    > span {
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;
      color: #ffffff;
    }
  }
  .lists {
    position: absolute;
    z-index: 100;
    width: 100%;
    top: 50px;
    border: 1px solid;
    box-sizing: border-box;
    background: #1b1e23;
    border: 1px solid #39424c;
    border-radius: 10px;
    overflow: hidden;

    > div {
      font-weight: 400;
      font-size: 16px;
      line-height: 19px;
      height: 60px;
      padding: 20px;
      box-sizing: border-box;
      color: #718096;

      &.active {
        color: #ffffff;
        background: #14171a;
        border-radius: 20px;
      }
    }
  }
`;
