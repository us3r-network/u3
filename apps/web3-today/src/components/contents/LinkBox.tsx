/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-17 16:00:23
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-07 17:35:08
 * @Description: file description
 */
import { useEffect, useState } from 'react';
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import {
  fetchPlatformImgUrlByLink,
  platformLogoReplaceMap,
} from '../../utils/platform';
import LinkSvgUrl from '../common/icons/svgs/link.svg';

type Props = StyledComponentPropsWithRef<'div'> & {
  logo?: string;
  text: string;
  displayOriginIcon?: boolean;
};

export default function LinkBox({
  logo,
  text,
  displayOriginIcon = true,
  ...otherProps
}: Props) {
  if (!text) return null;
  const [url, setUrl] = useState('');
  useEffect(() => {
    if (logo) {
      setUrl(platformLogoReplaceMap[logo] || logo);
      return;
    }
    fetchPlatformImgUrlByLink(text)
      .then((resp) => {
        setUrl(platformLogoReplaceMap[resp] || resp);
      })
      .catch(() => {
        setUrl('');
      });
  }, [logo, text]);
  return (
    <Box {...otherProps}>
      <PlatformImg
        src={displayOriginIcon ? url : LinkSvgUrl}
        onError={(e) => {
          if (displayOriginIcon) {
            e.currentTarget.src = LinkSvgUrl;
          }
        }}
      />
      <span>{text.replace(/(^\w+:|^)\/\//, '')}</span>
    </Box>
  );
}

const Box = styled.div`
  /* padding: 2px 4px; */
  height: 16px;
  box-sizing: border-box;
  background: #14171a;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 6px;

  > span {
    flex: 1;
    font-weight: 400;
    font-size: 12px;
    line-height: 14px;
    color: #718096;

    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }
`;
const PlatformImg = styled.img`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  margin-left: auto;
`;
