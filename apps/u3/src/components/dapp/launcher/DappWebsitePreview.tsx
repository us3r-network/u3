import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { useEffect, useState } from 'react';
import { selectWebsite } from '../../../features/shared/websiteSlice';
import { useAppSelector } from '../../../store/hooks';
import Loading from '../../common/loading/Loading';
import isUrl from '../../../utils/shared/isUrl';
import CannotOpenPlatFormLink from '../../news/event/CannotOpenPlatFormLink';

export type DappWebsitePreviewProps = StyledComponentPropsWithRef<'div'> & {
  data: {
    name?: string;
    image?: string;
    url?: string;
    supportIframe?: boolean;
  };
};
export default function DappWebsitePreview({
  data,
  ...otherProps
}: DappWebsitePreviewProps) {
  const { u3ExtensionInstalled } = useAppSelector(selectWebsite);
  const { image, url, name, supportIframe } = data;
  const displayCannotOpen = !supportIframe && !u3ExtensionInstalled;
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
`;
const PreviewIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
  background: #fff;
`;
