/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-14 10:59:34
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-27 16:18:53
 * @Description: file description
 */
import React, { useRef, useState } from 'react';

import AsyncSelect from 'react-select/async';
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { ScrollBarCss } from '../../../styles/GlobalStyle';
import ChevronDownSvg from '../assets/svgs/chevron-down.svg';

type ValueType = string | number;
export type Option = {
  value: ValueType;
  label: string;
};
type Props = StyledComponentPropsWithRef<'div'> & {
  value: ValueType;
  onChange?: (value: ValueType) => void;
  // eslint-disable-next-line react/no-unused-prop-types
  onSelectOption?: (option: Option) => void;
  valueField?: string;
  labelField?: string;
  getOptions: (inputValue: string) => Promise<any[]>;
  disabled?: boolean;
};
export default function ({
  value,
  onChange,
  onSelectOption,
  valueField = 'id',
  labelField = 'name',
  getOptions,
  disabled,
}: Props) {
  const [cacheOptions, setCacheOptions] = useState<Option[]>([]);
  const loadOptions = (inputValue, callback) => {
    getOptions(inputValue)
      .then((data) => {
        const options = data.map((item) => ({
          ...item,
          value: item[valueField],
          label: item[labelField],
        }));
        callback(options);
        setCacheOptions(options);
      })
      .catch((err) => callback([]));
  };
  const SelectValue = cacheOptions.find((item) => item.value === value);

  return (
    <AsyncSelectWrapper>
      <AsyncSelect
        isDisabled={!!disabled}
        defaultOptions
        value={SelectValue}
        onChange={(option) => {
          if (onChange) {
            onChange(option.value);
          }
          if (onSelectOption) {
            onSelectOption(option);
          }
        }}
        cacheOptions
        loadOptions={loadOptions}
        className="select-container"
        classNamePrefix="select"
        components={{
          IndicatorsContainer: CustomIndicatorsContainer,
        }}
      />
    </AsyncSelectWrapper>
  );
}

export function AsyncSelectV2({
  value,
  onChange,
  valueField = 'id',
  labelField = 'name',
  getOptions,
  disabled,
}: Props) {
  const cacheOptions = useRef<Option[]>([]);
  const loadOptions = (inputValue, callback) => {
    getOptions(inputValue)
      .then((data) => {
        const options = data.map((item) => ({
          id: item.id,
          image: item.image,
          name: item.name,
          value: item[valueField],
          label: item[labelField],
        }));
        callback(options);
        cacheOptions.current = options;
      })
      .catch((err) => callback([]));
  };
  return (
    <AsyncSelectWrapper>
      <AsyncSelect
        isDisabled={disabled}
        defaultOptions
        value={value}
        onChange={(option) => onChange(option)}
        cacheOptions
        loadOptions={loadOptions}
        className="select-container"
        classNamePrefix="select"
        components={{
          IndicatorsContainer: CustomIndicatorsContainer,
        }}
      />
    </AsyncSelectWrapper>
  );
}

function CustomIndicatorsContainer({ innerProps }: any) {
  return <ChevronDownIcon src={ChevronDownSvg} {...innerProps} />;
}

const AsyncSelectWrapper = styled.div`
  height: 40px;
  .select-container {
    height: 100%;
  }
  .select__control {
    height: 100%;
    border-radius: 20px;
    box-sizing: border-box;
    padding: 0px 20px;
    border: 1px solid #39424c;
    background: none;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    &:hover {
      border-color: #aaa;
    }
    .select__value-container {
      height: 100%;
      padding: 0;
      .select__placeholder {
        margin: 0;
        color: #4e5a6e;
      }
      .select__single-value {
        font-weight: 400;
        font-size: 16px;
        color: #fff;
      }
      .select__input-container {
        padding: 0;
        margin: 0;

        .select__input {
        }
      }
    }
  }
  .select__control--is-focused {
    box-shadow: none;
    &:focus-within {
      border-color: #555;
    }
  }
  .select__menu {
    margin-bottom: 10px;
    margin-top: 10px;
    background: #1b1e23;
    border: 1px solid #39424c;
    border-radius: 20px;
    .select__menu-list {
      ${ScrollBarCss}
      gap: 2;
      .select__option {
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
        background: none;
        color: #718096;
      }
      .select__option--is-focused {
        background: #14171a;
        color: #fff;
      }
    }
  }
`;
const ChevronDownIcon = styled.img`
  width: 20px;
  height: 20px;
  background-image: center no-repeat url(${ChevronDownSvg});
`;
