/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-09 19:37:12
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-08 18:04:29
 * @Description: file description
 */
import React, { useCallback, useState } from 'react';
import { debounce } from 'lodash';
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import SearchSvg from '../icons/svgs/search.svg';
import ClearSvg from '../icons/svgs/close.svg';

const Wrapper = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  padding: 0px 12px;
  box-sizing: border-box;
  background: #1a1e23;
  border: 1px solid #39424c;
  border-radius: 20px;
  gap: 10px;
  &:focus-within {
    border-color: #aaa;
  }
`;

const Icon = styled.img`
  width: 24px;
  height: 24px;
`;

const Input = styled.input`
  width: 0px;
  flex: 1;
  font-weight: 400;
  font-size: 16px;
  color: #fff;
  outline: none;
  border: none;
  background: transparent;

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

interface Props extends StyledComponentPropsWithRef<'div'> {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounce?: boolean; // 是否开启防抖 default: true
  debounceMs?: number; // 防抖间隔毫秒数 default: 300
  disabled?: boolean;
}

export default function SearchInput({
  onSearch,
  placeholder = 'Search',
  debounce: needDebounce = true,
  debounceMs = 300,
  disabled,
  ...otherProps
}: Props) {
  const [value, setValue] = useState('');

  const handleDebounceSearch = useCallback(
    debounce((query: string) => {
      onSearch(query);
    }, debounceMs),
    [onSearch, debounceMs]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
      if (needDebounce) {
        handleDebounceSearch(e.target.value);
      } else {
        onSearch(e.target.value);
      }
    },
    [setValue, needDebounce, handleDebounceSearch]
  );

  return (
    <Wrapper {...otherProps}>
      <Icon src={SearchSvg} className="search-input-icon" />
      <Input
        className="search-input-input"
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        disabled={disabled}
      />
    </Wrapper>
  );
}
