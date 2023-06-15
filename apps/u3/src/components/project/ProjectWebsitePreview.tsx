/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-14 10:28:05
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-27 12:18:01
 * @Description: file description
 */
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { useEffect, useState } from 'react';
import { selectWebsite } from '../../features/website/websiteSlice';
import { useAppSelector } from '../../store/hooks';
import Loading from '../common/loading/Loading';
import isUrl from '../../utils/isUrl';
import CannotOpenPlatFormLink from '../event/CannotOpenPlatFormLink';

export type ProjectWebsitePreviewProps = StyledComponentPropsWithRef<'div'> & {
  data: {
    name?: string;
    image?: string;
    url?: string;
  };
};
export default function ProjectWebsitePreview({
  data,
  ...otherProps
}: ProjectWebsitePreviewProps) {
  const { u3ExtensionInstalled } = useAppSelector(selectWebsite);
  const { image, url, name } = data;
  const displayCannotOpen = !u3ExtensionInstalled;
  const [iframeLoading, setIframeLoading] = useState(false);
  useEffect(() => {
    setIframeLoading(true);
  }, [data.url]);
  return (
    <PreviewWrapper {...otherProps}>
      {displayCannotOpen ? (
        <CannotOpenPlatFormLink
          iconUrl={image || ''}
          linkUrl={url}
          title={name}
        />
      ) : (
        isUrl(url) && (
          <PreviewIframeBox>
            <PreviewIframe
              src={url}
              onLoad={() => {
                setIframeLoading(false);
              }}
            />
            {iframeLoading && (
              <PreviewIframeLoadingBox>
                <Loading />
              </PreviewIframeLoadingBox>
            )}
          </PreviewIframeBox>
        )
      )}
    </PreviewWrapper>
  );
}
const PreviewWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  .admin-ops {
    position: absolute;
    top: 0;
    right: 0;
    padding: 15px;
    display: flex;
    gap: 10px;
  }
`;
const PreviewIframeBox = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;
const PreviewIframeLoadingBox = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #1b1e23;
`;
const PreviewIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;
