/* eslint-disable */
import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import styled from 'styled-components';
import html2canvas from 'html2canvas-strengthen';
import { toast } from 'react-toastify';

import { MOBILE_BREAK_POINT } from '../../constants';
import ModalBase, { ModalBaseTitle } from '../common/modal/ModalBase';
import { ButtonInfo, ButtonPrimary } from '../common/button/ButtonBase';

import { ReactComponent as LogoIconSvg } from '../common/assets/imgs/logo-icon.svg';
import { ReactComponent as MultipleSvg } from '../common/assets/imgs/multiple.svg';
import { ReactComponent as TwitterSvg } from '../common/assets/imgs/twitter.svg';
// import { ReactComponent as TwitterSvg } from '../common/assets/imgs/twitter.svg';
// import CloseSvg from '../common/assets/svgs/close.svg';
// import IconClose from '../icons/close';
import { Close } from '../common/icons/close';

import qrCodeU3 from '../common/assets/imgs/qrcode_u3.xyz.png';
import useLogin from '../../hooks/shared/useLogin';
import { uploadImage } from '../../services/shared/api/upload';
import { UserAvatar } from '@us3r-network/profile';

export default function Poster({
  data,
  isMobile,
}: {
  data: any;
  isMobile: boolean;
}) {
  const { contents, dapps, events } = data;

  const [isOpen, setIsOpen] = useState(false);
  const [posterCanvas, setPosterCanvas] = useState(null);
  const [posterUrl, setPosterUrl] = useState(null);

  const { user, isLogin } = useLogin();

  const posterModalBody = useRef(null);

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

  const sharePosterOnTwitter = async () => {
    setIsOpen(true);

    try {
      console.time('is to canvas time:');
      const canvas = await html2canvas(document.querySelector('#poster'), {
        allowTaint: true,
        useCORS: true,
        onclone: function (document) {
          (document.querySelector('#poster') as any).style.display = 'block';
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve(1);
            }, 400);
          });
        },
      });
      console.timeEnd('is to canvas time:');

      // document.body.appendChild(canvas);

      // posterModalBody?.current.insertBefore(
      //   canvas,
      //   posterModalBody?.current?.lastChild
      // );

      setPosterCanvas(canvas);

      const blob = dataURLtoBlob(canvas.toDataURL('image/png'));

      var file = new File([blob], 'name');

      uploadImage(file, user?.token)
        .then((result) => {
          setPosterUrl(result.data.url);
          // setUserForm({ ...userForm, avatar: result.data.url });
          // toast.success('poster share success');
        })
        .catch((error) =>
          toast.error('An error occurred in the generation of the poster')
        );
    } catch (error) {
      toast.error('An error occurred in the generation of the poster');
    }
    // finally {
    //   setIsOpen(false);
    // }
  };

  const PosterBox = useCallback(
    (isShowMobile?: boolean, isShow?: boolean) => (
      <Box id="poster" isShowMobile={isShowMobile} isShow={isShow}>
        <h1 className="topic">Daily Poster</h1>
        <div className="flex items-center sub-title justify-center">
          <div className="text">Today‘s Referrers</div>
          <div className="flex items-center col-gap-7">
            <LogoIconSvg />
            <MultipleSvg />
            <span>{user?.name}</span>
          </div>
          <div className="flex items-center avatar-box">
            <div className="user-avatar u3-avatar">
              <LogoIconSvg />
            </div>
            <UserAvatar className="user-avatar" />
            {/* <img
      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAACgBAMAAAB54XoeAAAAElBMVEUzMzP/+9siIiLk/9u/vKQZGRkml3AdAAAA8UlEQVRo3u3ZAQqCMBSH8Rh0gDrB6w+dwCvUBaLuf5Waw6EtHEPJqd9HUcTrx6NAEQ9ERERrScUBpuCpKEBAQEBAQMDdgvJ1k7HB933JGGAfbHqTTVsfjJ8OxgABAesGxw4OgHkwHyAgIOC2QZWDWhbUj5YBY8Wg1yaCm7rWAwQEBAQE3BlY/93b1YHX1/MWu78epaDJDR4JmAwUbmiTNzST+2ThTbrhcODTv39DObPwlGtfvsGwdzcgy4FOXW5kQ+sGLL+hKfx9Utj0mG5oXrN2wG9YmNPlFDvLDrk0c/sEmxkDBAQEBASsG6z/vFw5+AYAFLz3C2BQfgAAAABJRU5ErkJggg=="
      onError={(el: React.SyntheticEvent<HTMLImageElement, Event>) => {
        el.currentTarget.src = AvatarDefault;
      }}
      className="user-avatar"
    /> */}
          </div>
        </div>
        <div className="line-box">
          <div className="line" />
          <div className="line" />
        </div>
        <div className="contents">
          {contents?.slice(0, 3)?.map((content, index) => (
            <div key={content?.id}>
              <div className={index === 0 ? `big-title` : `title`}>
                {content?.title}
              </div>
              {content?.description && (
                <div className="desc">{content?.description}</div>
              )}
            </div>
          ))}

          {/* dapp */}
          <div>
            <h2 className="topic-h2">Which Dapps are Popular?</h2>

            <div className="dapp-box">
              {dapps?.slice(0, 6)?.map((dapp) => {
                const { image, name } = dapp;
                return (
                  <div className="dapp-item" key={dapp?.id}>
                    <img src={image} className="dapp-img" />
                    <div className="">{name}</div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* event */}
          {events?.slice(0, 3)?.map((event) => (
            <div key={event?.id}>
              <div className="flag">Trending Event</div>
              <div className="title">{event?.name}</div>
            </div>
          ))}
        </div>

        <div className="line-box">
          <div className="line" />
          <div className="line" />
        </div>

        <img className="qrcode" src={qrCodeU3} />

        <div className="website">U3.XYZ</div>
      </Box>
    ),
    [data]
  );

  return (
    <>
      {isLogin && (
        <ShareButtonBox isMobile={isMobile}>
          <div className="line" />
          <div className="button" onClick={() => sharePosterOnTwitter()}>
            Share Daily Poster
          </div>
          <div className="line" />
        </ShareButtonBox>
      )}
      {PosterBox()}
      <AuthProcessModalWrapper
        backdropFilter
        isOpen={isOpen}
        className={'wl-user-modal_signature wl-user-modal_signature_dark'}
        style={{
          content: {
            // position: 'absolute',
            // transform: 'translate(-50%, -50%)',
            top: '40%',
            left: '50%',
            marginTop: '15%',
            outline: 'none',
          },
        }}
      >
        <AuthProcessModalBody
          className="wl-user-modal_signature-body"
          id="poster-modal-body"
          ref={posterModalBody}
          isMobile={isMobile}
        >
          {/* {!posterCanvas && (
            <div className="poster-tip">Poster generation in progress... </div>
          )} */}
          {posterCanvas ? (
            PosterBox(isMobile, true)
          ) : (
            <div className="poster-tip">Poster generation in progress... </div>
          )}
          <div className="poster-modal-close" onClick={() => setIsOpen(false)}>
            <Close />
          </div>

          <AuthProcessModalBtns className="signature-btns">
            <CloseBtn
              className="signature-btn-cancel"
              onClick={() => {
                if (!posterUrl) return;
                download(posterUrl);
              }}
              disabled={!posterUrl}
            >
              <svg
                // class="icon"
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
            </CloseBtn>
            <RetryBtn
              onClick={() => {
                if (!posterUrl) return;

                openUrl(
                  `https://twitter.com/intent/tweet?text=Daily Poster ${posterUrl}&url=https%3A%2F%2Fu3.xyz%2F`
                );
              }}
              className="signature-btn-retry"
              disabled={!posterUrl}
            >
              <TwitterSvg />
              Share To Twitter
            </RetryBtn>
          </AuthProcessModalBtns>
        </AuthProcessModalBody>
      </AuthProcessModalWrapper>

      {/* <ModalBase isOpen={isOpen} backdropFilter></ModalBase> */}
    </>
  );
}

const ShareButtonBox = styled.div<{ isMobile: boolean }>`
  /* position: relative; */
  display: flex;
  align-items: center;
  column-gap: 40px;

  .button {
    width: ${(props) => (props.isMobile ? '100%' : '185px')};

    /* padding: 0 28px; */
    height: 48px;
    line-height: 48px;
    font-weight: 300;
    background: linear-gradient(52.42deg, #cd62ff 35.31%, #62aaff 89.64%),
      #ffffff;
    border-radius: 12px;

    text-align: center;
    /* margin: 0 auto; */
    cursor: pointer;
  }

  .line {
    height: 1px;
    flex-grow: 1;
    background: rgba(113, 128, 150, 0.5);
    display: ${(props) => (props.isMobile ? 'none' : 'block')};
  }
`;

const Box = styled.div<{ isShowMobile: boolean; isShow: boolean }>`
  /* width: 375px; */
  width: ${(props) => (props.isShowMobile ? '100vw' : '375px')};

  background: #131819;
  color: white;

  font-family: 'Marion';
  font-style: normal;
  padding: 20px 10px 75px;
  box-sizing: border-box;

  display: ${(props) => (props.isShow ? 'block' : 'none')};
  border: ${(props) => (props.isShow ? '1px solid #718096' : 'none')};
  border-radius: ${(props) => (props.isShow ? '20px' : '0px')};
  .topic {
    font-weight: 700;
    font-size: 60px;
    line-height: 63px;
    text-align: center;
    margin: 20px 0;
  }

  .topic-h2 {
    font-size: 30px;
    line-height: 32px;

    text-align: center;

    margin-bottom: 20px;
  }

  .sub-title {
    font-family: 'Snell Roundhand';
    /* font-style: italic; */
    font-weight: 700;
    font-size: 14px;
    line-height: 18px;
    margin-bottom: 20px;
    .multiple {
      margin: 0 7px;
    }
    & svg:first-of-type {
      width: 25px;
      height: 25px;
    }
    & path {
      fill: rgb(255, 255, 255);
    }
  }

  .text {
    margin-right: 20px;
  }

  .user-avatar {
    width: 25px;
    height: 25px;

    border-radius: 60px;
  }

  .u3-avatar {
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(52.42deg, #cd62ff 35.31%, #62aaff 89.64%);

    margin-right: -12px;
    margin-left: 20px;
    & svg {
      width: 20px;
      height: 20px;
    }
    & path {
      fill: rgb(255, 255, 255);
    }
  }

  /* .line-box{
    &:last-child{
        margin-top: 4px;
    }
  } */

  .line {
    height: 2px;
    background: white;
    &:last-child {
      margin-top: 4px;
    }
  }

  .contents {
    & > div {
      padding: 20px 0;
      border-bottom: 1px solid white;
      &:last-child {
        border: none;
      }
    }
  }

  .title {
    font-weight: 700;
    font-size: 20px;
    line-height: 21px;
  }

  .big-title {
    font-size: 30px;
    line-height: 38px;
    font-weight: bold;
  }

  .desc {
    font-weight: 400;
    font-size: 12px;
    line-height: 15px;
    letter-spacing: 1.1px;
    /* line-height: 13px; */

    margin-top: 10px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .flag {
    font-weight: 400;
    font-size: 12px;
    line-height: 13px;
    display: inline-block;
    /* identical to box height */

    background: linear-gradient(52.42deg, #cd62ff 35.31%, #62aaff 89.64%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;

    margin-bottom: 10px;
  }

  .dapp-box {
    /* .dapp {
      border-radius: 20px; */
    display: grid;
    grid-gap: 36px;
    grid-template-columns: repeat(auto-fill, minmax(82px, 1fr));
    text-align: center;
    .dapp-img {
      width: 100px;
      height: 100px;
      border-radius: 20px;
      margin-bottom: 10px;
      background: black;
    }
    /* } */
  }

  .qrcode {
    width: 200px;
    height: 200px;
    border-radius: 20px;
    margin: 20px auto;
    display: block;
  }

  .website {
    font-weight: 700;
    font-size: 12px;
    line-height: 13px;

    text-align: center;
    letter-spacing: 10px;
  }

  //-------- css ----------

  .flex {
    display: flex;
  }

  .items-center {
    align-items: center;
  }

  .justify-center {
    justify-content: center;
  }

  .col-gap-7 {
    column-gap: 7px;
  }
`;

const AuthProcessModalWrapper = styled(ModalBase)``;
const AuthProcessModalBody = styled.div<{ isMobile: boolean }>`
  /* width: 540px; */
  display: flex;
  flex-direction: column;
  gap: 20px;
  /* padding: 20px; */
  /* background: #f7f9f1; */
  border-radius: 20px;
  /* min-width: 380px; */
  min-width: ${(props) => (props.isMobile ? '100vw' : '380px')};

  /* background: rgb(27, 30, 35); */
  box-sizing: border-box;
  min-height: 700px;
  color: white;
  /* text-align: center; */
  position: relative;
  padding-bottom: 100px;

  .poster-tip {
    flex-grow: 1;
    display: flex;
    align-items: center;
    background: rgb(27, 30, 35);
    justify-content: center;
    border-radius: 20px;
    border: 1px solid #718096;
  }

  .poster-modal-close {
    position: absolute;
    top: 15px;
    right: 20px;
    /* top: 5px;
    right: -30px; */
    cursor: pointer;
  }

  canvas {
    border-radius: 20px;
    border: 1px solid #718096;
  }

  &:focus {
    border: none;
  }
`;
const AuthProcessModalDesc = styled.div`
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #333333;
`;
const AuthProcessModalBtns = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  gap: 24px;
`;
const CloseBtn = styled(ButtonInfo)`
  width: 50px;
  height: 48px;
  flex-grow: 0.1 !important;
`;
const RetryBtn = styled(ButtonPrimary)`
  width: 120px;
  height: 48px;
  flex-grow: 1;
  font-weight: 700;
`;
