/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-11-29 18:15:27
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-12-01 15:55:04
 * @FilePath: /u3/apps/u3/src/components/news/links/LinkContentBox.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { LinkListItem } from 'src/services/news/types/links';
import { contentParse } from 'src/services/news/api/contents';
import { Tweet } from 'react-tweet';
import { extractYoutubeVideoId } from 'src/utils/news/link';
import { selectWebsite } from '../../../features/shared/websiteSlice';
import { useAppSelector } from '../../../store/hooks';
import ExtensionSupport from '../../layout/ExtensionSupport';
import Loading from '../../common/loading/Loading';
import LinkReaderView from './LinkReaderView';

export type Tab = 'original' | 'readerView';

export default function LinkContentBox({
  selectLink,
  tab,
}: {
  selectLink: LinkListItem | null;
  tab: Tab;
}) {
  const { u3ExtensionInstalled } = useAppSelector(selectWebsite);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [readerviewLoaded, setReaderviewLoaded] = useState(false);

  useEffect(() => {
    setIframeLoaded(false);
  }, [selectLink?.url]);

  useEffect(() => {
    setReaderviewLoaded(false);
    if (!selectLink.readerView) {
      contentParse(selectLink?.url)
        .then((resp) => {
          selectLink.readerView = resp.data.data;
          selectLink.supportReaderView = true;
          setTimeout(() => {
            setReaderviewLoaded(true);
          }, 1000);
        })
        .catch((reason) => {
          selectLink.readerView = null;
          selectLink.supportReaderView = false;
          console.log(reason.message);
          setReaderviewLoaded(true);
        });
    } else {
      setReaderviewLoaded(true);
    }
  }, [selectLink]);

  return (
    <ContentBox>
      {(() => {
        if (!selectLink) return null;
        switch (tab) {
          case 'original':
            // X(Twitter)
            if (
              selectLink?.url.indexOf('twitter.com') > 0 ||
              selectLink?.url.indexOf('x.com') > 0
            ) {
              if (selectLink?.metadata?.provider === 'FixTweet / FixupX') {
                const tweetId = selectLink.url.split('/status/')[1];
                if (tweetId)
                  return (
                    <div className="dark">
                      <Tweet id={tweetId} />
                    </div>
                  );
              }
              return (
                <div className="info">
                  <p>{selectLink?.metadata?.title}</p>
                  <p>This Twitter Page Preview is NOT supported yet!</p>
                  <p>
                    <a href={selectLink.url} target="_blank" rel="noreferrer">
                      Open in New Tab
                    </a>
                  </p>
                </div>
              );
            }
            // Youtube
            if (
              selectLink?.url.indexOf('youtube.com') > 0 ||
              selectLink?.url.indexOf('youtu.be') > 0
            ) {
              let videoURL = '';
              if (selectLink?.metadata?.provider === 'YouTube') {
                if (selectLink?.metadata?.video) {
                  videoURL = selectLink?.metadata?.video;
                } else {
                  const videoId = extractYoutubeVideoId(selectLink?.url);
                  if (videoId)
                    videoURL = `https://www.youtube.com/embed/${videoId}`;
                }
                if (videoURL)
                  return (
                    <div className="iframe-container">
                      {!iframeLoaded && (
                        <LoadingBox>
                          <Loading />
                        </LoadingBox>
                      )}
                      <iframe
                        src={videoURL}
                        title="YouTube video player"
                        style={{
                          opacity: iframeLoaded ? 1 : 0,
                          inset: 0,
                          background: 'transparent',
                        }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        onLoad={() => {
                          setIframeLoaded(true);
                        }}
                      />
                    </div>
                  );
                return (
                  <div className="info">
                    <h3>{selectLink?.metadata?.title}</h3>
                    <p>{selectLink?.metadata?.description}</p>
                    <p>This Youtube Page Preview is NOT supported yet!</p>
                    <p>
                      <a
                        href={selectLink?.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open in New Tab
                      </a>
                    </p>
                  </div>
                );
              }
            }
            // Zora
            if (selectLink?.url.indexOf('zora.co') > 0)
              if (selectLink?.metadata?.provider === 'zora') {
                const removePremintUrl = selectLink?.url.replace(
                  'premint-',
                  ''
                );
                const zoraEmbedUrl =
                  removePremintUrl.indexOf('?') > 0
                    ? selectLink?.url.replace('?', '/embed?')
                    : `${selectLink?.url}/embed`;
                return (
                  <div className="iframe-container">
                    {!iframeLoaded && (
                      <LoadingBox>
                        <Loading />
                      </LoadingBox>
                    )}
                    <iframe
                      src={zoraEmbedUrl}
                      title={selectLink?.metadata?.title}
                      style={{
                        opacity: iframeLoaded ? 1 : 0,
                        inset: 0,
                        background: 'transparent',
                      }}
                      onLoad={() => {
                        setIframeLoaded(true);
                      }}
                      allowFullScreen
                      sandbox="allow-pointer-lock allow-same-origin allow-scripts allow-popups"
                    />
                  </div>
                );
              }
            // Spotify
            if (selectLink?.url.indexOf('spotify.com') > 0)
              if (selectLink?.metadata?.provider === 'Spotify') {
                const spotifyEmbedUrl = selectLink?.url.replace(
                  'spotify.com',
                  'spotify.com/embed'
                );
                return (
                  <div className="iframe-container">
                    {!iframeLoaded && (
                      <LoadingBox>
                        <Loading />
                      </LoadingBox>
                    )}
                    <iframe
                      src={spotifyEmbedUrl}
                      title={selectLink?.metadata?.title}
                      style={{
                        opacity: iframeLoaded ? 1 : 0,
                        inset: 0,
                        background: 'transparent',
                      }}
                      onLoad={() => {
                        setIframeLoaded(true);
                      }}
                      allowFullScreen
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      sandbox="allow-pointer-lock allow-same-origin allow-scripts allow-popups"
                      loading="lazy"
                    />
                  </div>
                );
              }
            if (u3ExtensionInstalled || selectLink?.supportIframe) {
              return (
                <div className="iframe-container">
                  {!iframeLoaded && (
                    <LoadingBox>
                      <Loading />
                    </LoadingBox>
                  )}
                  <iframe
                    title={selectLink?.metadata?.title}
                    src={selectLink?.url}
                    style={{
                      opacity: iframeLoaded ? 1 : 0,
                    }}
                    onLoad={() => {
                      setIframeLoaded(true);
                    }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              );
            }
            return (
              <ExtensionSupport
                btns
                url={selectLink.url}
                title={selectLink.metadata?.title}
              />
            );

            break;
          case 'readerView':
            if (readerviewLoaded) {
              if (selectLink.readerView) {
                return <LinkReaderView data={selectLink} />;
              }
              return (
                <ExtensionSupport
                  url={selectLink.url}
                  title={selectLink.metadata?.title}
                  msg="Reader view is not supported for this page! Please view it in the original tab."
                />
              );
            }
            return (
              <LoadingBox>
                <Loading />
              </LoadingBox>
            );
            break;
          default:
            return null;
        }
      })()}
    </ContentBox>
  );
}

export const ContentBox = styled.div`
  width: 100%;
  height: 100%;
  overflow-x: hidden;

  & img {
    max-width: 100%;
  }

  & pre {
    overflow: scroll;
  }

  & .iframe-container {
    width: 100%;
    height: 100%;

    & iframe {
      border: 0;
      width: 100%;
      height: 100%;
    }
  }

  & .dark {
    width: 100%;
    display: flex;
    justify-content: center;
    overflow: scroll;
    /* & div {
      overflow: scroll;
    } */
  }

  & .info {
    padding: 20px;
    font-size: 14px;
    color: #fff;
  }
`;

export const LoadingBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100% - 60px);
`;
