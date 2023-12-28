/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-17 16:00:23
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-07 17:35:08
 * @Description: file description
 */
import { ComponentPropsWithRef, useEffect, useState } from 'react';
import {
  fetchPlatformImgUrlByLink,
  platformLogoReplaceMap,
} from '../../../utils/shared/platform';
import LinkSvgUrl from '../../common/assets/svgs/link.svg';
import { cn } from '@/lib/utils';

type LinkLogoProps = ComponentPropsWithRef<'img'> & {
  logo: string;
  link: string;
  errorLogo?: string;
};
export default function LinkLogo({
  logo,
  link,
  errorLogo,
  className,
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
    <img
      className={cn('w-[16px] h-[16px] object-cover flex-shrink-0', className)}
      src={url}
      alt=""
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
