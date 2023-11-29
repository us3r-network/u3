import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { LinkListItem } from 'src/services/news/types/links';
import { contentParse } from 'src/services/news/api/contents';
import { Tweet } from 'react-tweet';
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
            // Github
            // if (selectLink?.url.indexOf('github.com') > 0) {
            //   if (selectLink?.metadata?.provider === 'GitHub') {
            //     console.log('github', selectLink);
            //     return <GithubPreview url={selectLink.url} />;
            //   }
            // }
            // Youtube
            if (
              selectLink?.url.indexOf('youtube.com') > 0 ||
              selectLink?.url.indexOf('youtu.be') > 0
            ) {
              if (selectLink?.metadata?.provider === 'YouTube') {
                const videoId = extractYoutubeVideoId(selectLink?.url);
                if (videoId)
                  return (
                    <div className="iframe-container">
                      {!iframeLoaded && (
                        <LoadingBox>
                          <Loading />
                        </LoadingBox>
                      )}
                      <iframe
                        src={`https://www.youtube.com/embed/${videoId}`}
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
                    <p>{selectLink?.metadata?.title}</p>
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
                console.log('zoraEmbedUrl', zoraEmbedUrl, selectLink);
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
                      allowTransparency
                      allowFullScreen
                      sandbox="allow-pointer-lock allow-same-origin allow-scripts allow-popups"
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
  /* display: flex;
  justify-content: center;
  align-items: center; */

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

function extractYoutubeVideoId(url: string) {
  const patterns = ['v=', 'youtu.be/', '/embed/', '/live/', '/shorts/'];
  if (!url) return null;
  console.log(url);
  let videoId = '';
  patterns.forEach((pattern) => {
    if (url.indexOf(pattern) > 0) {
      [, videoId] = url.split(pattern);
      [videoId] = videoId.split('&');
    }
  });
  return videoId;
}

// function GithubPreview({ url }: { url: string }) {
//   const [iframeSrc, setIframeSrc] = useState(null);
//   const apiUrl = url.replace('github.com', 'api.github.com/repos');
//   fetch(apiUrl)
//     .then((response) => {
//       return response.json();
//     })
//     .then((data) => {
//       console.log(data);
//       setIframeSrc(`data:text/html;base64,${encodeURIComponent(data.content)}`);
//     });
//   return (
//     iframeSrc && (
//       <iframe
//         id="github-iframe"
//         title="Github Page Preview"
//         src={iframeSrc}
//         width="100%"
//         height="100%"
//         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
//         allowFullScreen
//       />
//     )
//   );
// }
