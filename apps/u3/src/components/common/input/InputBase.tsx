/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-13 14:37:26
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-08 18:04:52
 * @Description: file description
 */
import React, { useCallback } from 'react';
import { debounce } from 'lodash';
import styled, { StyledComponentPropsWithRef, css } from 'styled-components';
import ClearSvg from '../assets/svgs/close.svg';

export const InputBaseCss = css`
  width: 100%;
  height: 40px;
  font-weight: 400;
  font-size: 16px;
  color: #fff;
  outline: none;
  display: flex;
  align-items: center;
  padding: 0px 12px;
  box-sizing: border-box;
  background: #1a1e23;
  border: 1px solid #39424c;
  border-radius: 12px;
  gap: 10px;
  &:focus-within {
    border-color: #aaa;
    background-color: #14171a;
  }

  &::placeholder {
    color: #4e5a6e;
  }
  &::-webkit-search-cancel-button {
    appearance: none;
    height: 16px;
    width: 16px;
    border-radius: 50%;
    background-color: #14171a;
    background-image: url(${ClearSvg});
    background-size: cover;
    background-repeat: no-repeat;
  }
`;
const Input = styled.input`
  ${InputBaseCss}
`;

export interface Props extends StyledComponentPropsWithRef<'input'> {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  debounce?: boolean; // 是否开启防抖 default: false
  debounceMs?: number; // 防抖间隔毫秒数 default: 300
}

export default function InputBase({
  value,
  onChange,
  placeholder = 'Placeholder',
  debounce: needDebounce,
  debounceMs = 300,
  ...otherProps
}: Props) {
  const handleDebounceSearch = useCallback(
    debounce((e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) onChange(e);
    }, debounceMs),
    [onChange, debounceMs]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (needDebounce) {
        handleDebounceSearch(e);
      } else if (onChange) onChange(e);
    },
    [needDebounce, handleDebounceSearch]
  );

  return (
    <Input
      type="search"
      placeholder={placeholder}
      value={value}
      onChange={handleInputChange}
      {...otherProps}
    />
  );
}
