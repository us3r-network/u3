/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-13 14:37:26
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-31 16:30:41
 * @Description: file description
 */
import React, { useCallback } from 'react';
import { debounce } from 'lodash';
import styled, { StyledComponentPropsWithRef, css } from 'styled-components';

export const TextareaBaseCss = css`
  width: 100%;
  height: 80px;
  resize: both;
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
`;
const Textarea = styled.textarea`
  ${TextareaBaseCss}
`;

export interface Props extends StyledComponentPropsWithRef<'textarea'> {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  debounce?: boolean; // 是否开启防抖 default: false
  debounceMs?: number; // 防抖间隔毫秒数 default: 300
}

export default function TextareaBase({
  value,
  onChange,
  placeholder = 'Placeholder',
  debounce: needDebounce,
  debounceMs = 300,
  ...otherProps
}: Props) {
  const handleDebounceSearch = useCallback(
    debounce((e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (onChange) onChange(e);
    }, debounceMs),
    [onChange, debounceMs]
  );

  const handleTextareaChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (needDebounce) {
        handleDebounceSearch(e);
      } else if (onChange) onChange(e);
    },
    [needDebounce, handleDebounceSearch]
  );

  return (
    <Textarea
      placeholder={placeholder}
      value={value}
      onChange={handleTextareaChange}
      {...otherProps}
    />
  );
}
