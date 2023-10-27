/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-14 10:59:34
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-03-06 19:44:28
 * @Description: file description
 */
import CreatableSelect from 'react-select/creatable';
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { ScrollBarCss } from '../../../styles/GlobalStyle';
import ChevronDownSvg from '../assets/svgs/chevron-down.svg';

type ValueType = string | number;
export type Option = {
  value: ValueType;
  label: string;
};
type Props = StyledComponentPropsWithRef<'div'> & {
  options: Option[];
  value: ValueType[];
  placeholder?: string;
  onChange?: (values: ValueType[]) => void;
  onSelectOption?: (options: Option[]) => void;
  onCreateOption?: (inputValue: string) => void;
};
export default function ({
  options,
  value,
  placeholder,
  onChange,
  onSelectOption,
  onCreateOption,
}: Props) {
  const SelectValue = options.filter((item) => value.includes(item.value));
  const handleChange = (ops: Option[]) => {
    if (onChange) {
      onChange(ops.map((item) => item.value));
    }
    if (onSelectOption) {
      onSelectOption([...ops]);
    }
  };
  return (
    <AsyncSelectWrapper>
      <CreatableSelect
        isMulti
        placeholder={placeholder}
        options={options}
        value={SelectValue}
        onChange={handleChange}
        className="select-container"
        classNamePrefix="select"
        components={{
          IndicatorsContainer: CustomIndicatorsContainer,
        }}
        onCreateOption={onCreateOption}
      />
    </AsyncSelectWrapper>
  );
}

function CustomIndicatorsContainer({ innerProps }: any) {
  return <ChevronDownIcon src={ChevronDownSvg} {...innerProps} />;
}

const AsyncSelectWrapper = styled.div`
  min-height: 40px;
  .select-container {
    height: 100%;
  }
  .select__control {
    height: 100%;
    border-radius: 20px;
    box-sizing: border-box;
    padding: 0px 12px;
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
        color: #fff;
      }
      .select__multi-value {
        background-color: #718096;
        border-radius: 10px;
        .select__multi-value__label {
          color: #fff;
        }
        .select__multi-value__remove {
          border-radius: 50%;
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
