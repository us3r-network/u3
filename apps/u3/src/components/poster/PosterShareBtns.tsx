/* eslint-disable */
import styled from 'styled-components';
import { useState } from 'react';
import { ButtonInfo, ButtonPrimary } from '../common/button/ButtonBase';
import { ReactComponent as TwitterSvg } from '../../common/assets/imgs/twitter.svg';
import html2canvas from 'html2canvas-strengthen';
import useLogin from '../../hooks/shared/useLogin';
import { uploadImage } from '../../services/shared/api/upload';
import { toast } from 'react-toastify';
import Loading from '../common/loading/Loading';

const dataURLtoBlob = (dataURL) => {
  let array, binary, i, len;
  binary = atob(dataURL.split(',')[1]);
  array = [];
  i = 0;
  len = binary.length;
  while (i < len) {
    array.push(binary.charCodeAt(i));
    i++;
  }
  return new Blob([new Uint8Array(array)], {
    type: 'image/png',
  });
};

const download = async (url, name = 'u3-daily-poster', type = 'png') => {
  const toDataURL = (url) => {
    return fetch(url)
      .then((response) => {
        return response.blob();
      })
      .then((blob) => {
        return URL.createObjectURL(blob);
      });
  };
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = await toDataURL(url);
  a.download = name + '.' + type;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const openUrl = (url) => {
  var a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('style', 'display:none');
  a.setAttribute('target', '_blank');
  document.body.appendChild(a);
  a.click();
  a.parentNode.removeChild(a);
};

export default function PosterShareBtns({
  targetId,
  posterUrl,
  setPosterUrl,
}: {
  posterUrl: string;
  setPosterUrl: (url: string) => void;
  targetId: string;
}) {
  const { user } = useLogin();
  const [posterCanvas, setPosterCanvas] = useState(null);
  const [canvasLoading, setCanvasLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [actionType, setActionType] = useState<'download' | 'share' | ''>('');
  const genCanvas = async () => {
    console.time('is to canvas time:');
    const el = document.querySelector(`#${targetId}`) as any;
    const canvas = await html2canvas(el, {
      allowTaint: true,
      useCORS: true,
      onclone: function (document) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(1);
          }, 400);
        });
      },
    });
    console.timeEnd('is to canvas time:');
    return canvas;
  };
  const getUrl = async () => {
    if (posterUrl) return posterUrl;

    let canvas = posterCanvas;
    if (!canvas) {
      setCanvasLoading(true);
      try {
        canvas = await genCanvas();
        setPosterCanvas(canvas);
      } catch (error) {
        throw error;
      } finally {
        setCanvasLoading(false);
      }
    }

    try {
      setUploadLoading(true);
      const blob = dataURLtoBlob(canvas.toDataURL('image/png'));
      var file = new File([blob], 'name');
      const res = await uploadImage(file, user?.token);
      setPosterUrl(res.data.url);
      return res.data.url;
    } catch (error) {
      throw error;
    } finally {
      setUploadLoading(false);
    }
  };

  const downloadPoster = async () => {
    setActionType('download');
    try {
      const url = await getUrl();
      download(url);
    } catch (error) {
      toast.error('An error occurred in the generation of the poster');
    }
  };
  const sharePosterOnTwitter = async () => {
    setActionType('share');
    try {
      const url = await getUrl();
      openUrl(
        `https://twitter.com/intent/tweet?text=Daily Poster ${url}&url=https%3A%2F%2Fu3.xyz%2F`
      );
    } catch (error) {
      toast.error('An error occurred in the generation of the poster');
    }
  };
  return (
    <Wrapper>
      <DownloadBtn
        onClick={downloadPoster}
        disabled={canvasLoading || uploadLoading}
      >
        {actionType === 'download' && (canvasLoading || uploadLoading) ? (
          <Loading scale={0.3} />
        ) : (
          <DownloadIcon />
        )}
      </DownloadBtn>
      <ShareBtn
        onClick={sharePosterOnTwitter}
        disabled={canvasLoading || uploadLoading}
      >
        <TwitterSvg />
        {actionType === 'share' && (canvasLoading || uploadLoading)
          ? 'Generating Daily Poster ...'
          : 'Share To Twitter'}
      </ShareBtn>
    </Wrapper>
  );
}
function DownloadIcon() {
  return (
    <svg
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="19235"
      width="17"
      height="17"
    >
      <path
        d="M489.6 790.4c3.2 3.2 6.4 6.4 9.6 6.4 3.2 0 6.4 3.2 12.8 3.2 3.2 0 9.6 0 12.8-3.2 3.2-3.2 6.4-3.2 9.6-6.4l272-272c12.8-12.8 12.8-32 0-44.8-12.8-12.8-32-12.8-44.8 0L544 691.2V96c0-19.2-12.8-32-32-32s-32 12.8-32 32v595.2l-217.6-217.6c-12.8-12.8-32-12.8-44.8 0-12.8 12.8-12.8 32 0 44.8l272 272z"
        p-id="19236"
        fill="#718096"
      ></path>
      <path
        d="M960 576c-19.2 0-32 12.8-32 32v256c0 19.2-12.8 32-32 32H128c-19.2 0-32-12.8-32-32v-256c0-19.2-12.8-32-32-32s-32 12.8-32 32v256c0 54.4 41.6 96 96 96h768c54.4 0 96-41.6 96-96v-256c0-19.2-12.8-32-32-32z"
        p-id="19237"
        fill="#718096"
      ></path>
    </svg>
  );
}
const Wrapper = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;
const DownloadBtn = styled(ButtonInfo)`
  width: 50px;
  height: 48px;
  flex-grow: 0.1 !important;
`;
const ShareBtn = styled(ButtonPrimary)`
  width: 120px;
  height: 48px;
  flex-grow: 1;
  font-weight: 700;
`;
