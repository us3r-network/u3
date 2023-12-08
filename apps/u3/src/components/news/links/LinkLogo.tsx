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
} from '../../../utils/shared/platform';
import LinkSvgUrl from '../../common/assets/svgs/link.svg';

type LinkLogoProps = StyledComponentPropsWithRef<'img'> & {
  logo: string;
  link: string;
  errorLogo?: string;
};
export default function LinkLogo({
  logo,
  link,
  errorLogo,
  ...otherProps
}: LinkLogoProps) {
  const [url, setUrl] = useState(platformLogoReplaceMap[logo] || logo);
  useEffect(() => {
    if (logo) {
      return;
    }
    if (!link) return;
    fetchPlatformImgUrlByLink(link)
      .then((resp) => {
        setUrl(platformLogoReplaceMap[resp] || resp);
      })
      .catch(() => {
        setUrl('');
      });
  }, [logo, link]);
  return (
    <PlatformImg
      src={url}
      onError={(e) => {
        if (errorLogo && e.currentTarget.src !== errorLogo) {
          e.currentTarget.src = errorLogo;
        } else {
          e.currentTarget.src = LinkSvgUrl;
        }
      }}
      {...otherProps}
    />
  );
}

const PlatformImg = styled.img`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  margin-left: auto;
`;
