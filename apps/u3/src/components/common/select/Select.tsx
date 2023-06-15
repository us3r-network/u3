/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-12 15:24:35
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-27 13:59:33
 * @Description: file description
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import styled, { css, StyledComponentPropsWithRef } from 'styled-components';
import ChevronDownSvg from '../icons/svgs/chevron-down.svg';

type ValueType = any;
export type SelectOption = {
  value: ValueType;
  label: string;
  iconUrl?: string;
};
export type Props = StyledComponentPropsWithRef<'div'> & {
  options: SelectOption[];
  value: ValueType;
  placeholder?: string;
  onChange?: (value: ValueType) => void;
  onSelectOption?: (option: SelectOption) => void;
  iconUrl?: string;
};
export default function Select({
  options,
  value,
  placeholder = 'Select...',
  onChange,
  onSelectOption,
  iconUrl,
  ...wrapperProps
}: Props) {
  const selectButtonRef = useRef();
  const [openOptions, setOpenOptions] = useState(false);
  const option = useMemo(
    () => options.find((item) => item.value === value),
    [options, value]
  );

  useEffect(() => {
    const windowClick = (e) => {
      if (
        e.target === selectButtonRef.current ||
        (e.target as HTMLElement).parentNode === selectButtonRef.current
      )
        return;
      setOpenOptions(false);
    };
    document.addEventListener('click', windowClick);
    return () => document.removeEventListener('click', windowClick);
  }, [setOpenOptions]);
  return (
    <SelectWrapper {...wrapperProps}>
      <SelectButton
        ref={selectButtonRef}
        className="select-button"
        onClick={(e) => {
          // e.stopPropagation();
          setOpenOptions(!openOptions);
        }}
      >
        {iconUrl && (
          <SelectButtonBeforeIcon
            className="select-button-before-icon"
            src={iconUrl}
          />
        )}

        {option ? (
          <SelectButtonText className="select-button-text">
            {option.label}
          </SelectButtonText>
        ) : (
          <SelectButtonPlaceholder className="select-button-placeholder">
            {placeholder}
          </SelectButtonPlaceholder>
        )}

        <SelectButtonChevronIcon
          className="select-button-chevron-icon"
          src={ChevronDownSvg}
        />
      </SelectButton>

      {openOptions && (
        <OptionsBox className="select-options-box">
          {options.map((item) => (
            <OptionItem
              className="select-option-item"
              key={item.value}
              isActive={item.value === value}
              onClick={() => {
                if (onChange) {
                  onChange(item.value);
                }
                if (onSelectOption) {
                  onSelectOption(item);
                }
                setOpenOptions(false);
              }}
            >
              {item.iconUrl && (
                <OptionIcon
                  src={item.iconUrl}
                  className="select-option-item-icon"
                />
              )}
              <OptionLabel className="select-option-item-label">
                {item.label}
              </OptionLabel>
            </OptionItem>
          ))}
        </OptionsBox>
      )}
    </SelectWrapper>
  );
}
const SelectWrapper = styled.div`
  height: 40px;
  position: relative;
`;
const SelectButton = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 20px;
  box-sizing: border-box;
  padding: 8px 20px;
  border: 1px solid #39424c;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  &:hover {
    border: 1px solid #aaa;
    background-color: #14171a;
  }
`;
const SelectButtonBeforeIcon = styled.img`
  width: 24px;
  height: 24px;
`;
const SelectButtonTextCss = css`
  flex: 1;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: #ffffff;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;
const SelectButtonText = styled.span`
  ${SelectButtonTextCss}
`;
const SelectButtonPlaceholder = styled.span`
  ${SelectButtonTextCss}
  color: #4e5a6e;
`;
const SelectButtonChevronIcon = styled.img`
  width: 20px;
  height: 20px;
`;
const OptionsBox = styled.div`
  min-width: 100%;
  max-height: 50vh;
  position: absolute;
  left: 0;
  top: 100%;
  margin-bottom: 10px;
  margin-top: 10px;

  display: flex;
  flex-direction: column;
  gap: 2px;

  background: #1b1e23;
  border: 1px solid #39424c;
  border-radius: 20px;
  z-index: 1;
  overflow-y: auto;
`;
const OptionItem = styled.div<{ isActive: boolean }>`
  height: 40px;
  padding: 20px;
  box-sizing: border-box;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  background: ${(props) => (props.isActive ? '#14171A' : 'none')};
  color: ${(props) => (props.isActive ? '#fff' : '#718096')};
  &:hover {
    ${(props) =>
      !props.isActive &&
      `
        background: #14171a;
        opacity: 0.6;
      `};
  }
`;
const OptionIcon = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 50%;
`;
const OptionLabel = styled.span`
  white-space: nowrap;
`;
