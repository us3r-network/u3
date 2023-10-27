/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-12 15:24:35
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-28 22:49:19
 * @Description: file description
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { isMobile } from 'react-device-detect';
import styled, { css, StyledComponentPropsWithRef } from 'styled-components';
import { ButtonPrimaryLine } from '../button/ButtonBase';
import ChoiceCheckedSvg from '../assets/svgs/choice-checked.svg';

type ValueType = any;
export type CheckboxMultiChoiceOption = {
  value: ValueType;
  label: string;
  iconUrl?: string;
};
export type Props = StyledComponentPropsWithRef<'div'> & {
  label?: string;
  options: CheckboxMultiChoiceOption[];
  value: ValueType[];
  onChange?: (value: ValueType[]) => void;
  onSelectOption?: (options: CheckboxMultiChoiceOption[]) => void;
};
export default function CheckboxMultiChoice({
  label,
  options,
  value,
  onChange,
  onSelectOption,
  ...wrapperProps
}: Props) {
  const selectOptions = useMemo(
    () => options.filter((item) => value.includes(item.value)),
    [options, value]
  );
  return (
    <CheckboxMultiChoiceWrapper {...wrapperProps}>
      {label && (
        <CheckboxMultiChoiceLabel className="checkbox-multi-choice-label">
          {label}:{' '}
        </CheckboxMultiChoiceLabel>
      )}

      <OptionsBox className="checkbox-multi-choice-box">
        {options.map((item) => {
          const isChecked = value.includes(item.value);
          return (
            <OptionItem
              className="option-item"
              key={item.value}
              isChecked={isChecked}
              onClick={() => {
                if (onSelectOption) {
                  onSelectOption(
                    isChecked
                      ? selectOptions.filter((o) => o.value !== item.value)
                      : [...selectOptions, item]
                  );
                }
                if (onChange) {
                  onChange(
                    isChecked
                      ? value.filter((v) => v !== item.value)
                      : [...value, item.value]
                  );
                }
              }}
            >
              {item.iconUrl && (
                <OptionIcon src={item.iconUrl} className="option-item-icon" />
              )}
              <OptionLabel className="option-item-label">
                {item.label}
              </OptionLabel>
              {isChecked && (
                <CheckedIcon
                  src={ChoiceCheckedSvg}
                  className="option-item-checked-icon"
                />
              )}
            </OptionItem>
          );
        })}
      </OptionsBox>
    </CheckboxMultiChoiceWrapper>
  );
}
const CheckboxMultiChoiceWrapper = styled.div`
  display: flex;
  align-items: flex-start;

  ${isMobile &&
  `
    flex-direction: column;
  `}
`;

const CheckboxMultiChoiceLabel = styled.div`
  min-width: 100px;
  height: 40px;
  margin-right: 20px;
  font-weight: 400;
  font-size: 16px;
  line-height: 40px;
  color: #748094;
  ${isMobile &&
  `
    font-weight: 500;
    color: #fff;
  `}
`;
const OptionsBox = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 20px;
  flex-flow: wrap;
  ${isMobile &&
  `
    gap: 10px;
  `}
`;
const OptionItem = styled(ButtonPrimaryLine)<{ isChecked: boolean }>`
  height: 40px;
  padding: 8px 16px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${(props) => (props.isChecked ? '#fff' : '#718096')};
  border-color: ${(props) => (props.isChecked ? '#fff' : '#39424C')};
`;
const OptionIcon = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 50%;
`;
const OptionLabel = styled.span`
  white-space: nowrap;
`;
const CheckedIcon = styled.img`
  width: 18px;
  height: 18px;
`;
