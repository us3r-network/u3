/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-18 16:57:43
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-03-02 11:52:09
 * @Description: file description
 */
import { useState } from 'react';
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import Slider from 'react-slick';
import Card, { CardTitle } from './Card';
import ModalBase, { ModalBaseBody } from '../../common/modal/ModalBase';
// import CloseSvg from '../../common/assets/svgs/close.svg';

import ComingSoonImgUrl from './imgs/screeshots.png';
// import ComingSoonImgUrl from './imgs/screeshots.png';
import picNextCur from './imgs/pic_next.png';
import picPrevCur from './imgs/pic_prev.png';
import { SectionTitle } from './SectionTitle';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

type Props = StyledComponentPropsWithRef<'div'> & {
  urls: string[];
};
const settings = {
  arrows: false,
  dots: true,
  // autoplay: true,
  infinite: true,
  speed: 500,
  slidesToShow: 2,
  slidesToScroll: 2,
  className: 'slides',
  dotsClass: 'slick-dots slick-thumb',
};
export default function Screeshots({ urls, ...otherProps }: Props) {
  const [showImgIndex, setShowImgIndex] = useState(-1);

  const closePictureViewer = () => setShowImgIndex(-1);
  return (
    <ScreeshotsWrapper {...otherProps}>
      <CardTitle>Screeshots</CardTitle>
      <SliderWrapper>
        <Slider {...settings}>
          {urls.map((url, index) => (
            <ScreeshotImg
              key={url}
              src={url}
              onClick={() => setShowImgIndex(index)}
            />
          ))}
        </Slider>
      </SliderWrapper>
      <ModalBase
        isOpen={showImgIndex !== -1}
        onRequestClose={closePictureViewer}
        backdropFilter
        style={{ overlay: { zIndex: 1000 }, content: { overflow: 'visible' } }}
      >
        <ModalBody onClick={closePictureViewer}>
          <svg
            className="icon"
            viewBox="0 0 1024 1024"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
          >
            <path
              d="M574.55 522.35L904.4 192.5c16.65-16.65 16.65-44.1 0-60.75l-1.8-1.8c-16.65-16.65-44.1-16.65-60.75 0L512 460.25l-329.85-330.3c-16.65-16.65-44.1-16.65-60.75 0l-1.8 1.8c-17.1 16.65-17.1 44.1 0 60.75l329.85 329.85L119.6 852.2c-16.65 16.65-16.65 44.1 0 60.75l1.8 1.8c16.65 16.65 44.1 16.65 60.75 0L512 584.9l329.85 329.85c16.65 16.65 44.1 16.65 60.75 0l1.8-1.8c16.65-16.65 16.65-44.1 0-60.75L574.55 522.35z"
              fill="#718096"
            />
          </svg>
          {showImgIndex > 0 && (
            <div
              className="picture-viewer prev"
              onClick={(e) => {
                e.stopPropagation();
                setShowImgIndex((index) => index - 1);
              }}
            >
              <svg
                viewBox="0 0 1024 1024"
                xmlns="http://www.w3.org/2000/svg"
                width="19"
                height="19"
              >
                <path
                  d="M614.213818 71.819636a58.181818 58.181818 0 0 1 77.940364 86.318546l-3.095273 2.792727-379.880727 319.092364a34.909091 34.909091 0 0 0-4.282182 49.198545l1.861818 2.024727 1.978182 1.861819 381.021091 330.589091A58.181818 58.181818 0 0 1 616.750545 954.181818l-3.258181-2.629818L232.494545 621.032727a151.272727 151.272727 0 0 1-2.56-226.280727l4.398546-3.816727L614.213818 71.819636z"
                  fill="#14171A"
                />
              </svg>
            </div>
          )}
          {showImgIndex < urls.length - 1 && (
            <div
              className="picture-viewer next"
              onClick={(e) => {
                e.stopPropagation();
                setShowImgIndex((index) => index + 1);
              }}
            >
              <svg
                viewBox="0 0 1024 1024"
                xmlns="http://www.w3.org/2000/svg"
                width="19"
                height="19"
              >
                <path
                  d="M312.888889 995.555556c-17.066667 0-28.444444-5.688889-39.822222-17.066667-22.755556-22.755556-17.066667-56.888889 5.688889-79.644445l364.088888-329.955555c11.377778-11.377778 17.066667-22.755556 17.066667-34.133333 0-11.377778-5.688889-22.755556-17.066667-34.133334L273.066667 187.733333c-22.755556-22.755556-28.444444-56.888889-5.688889-79.644444 22.755556-22.755556 56.888889-28.444444 79.644444-5.688889l364.088889 312.888889c34.133333 28.444444 56.888889 73.955556 56.888889 119.466667s-17.066667 85.333333-51.2 119.466666l-364.088889 329.955556c-11.377778 5.688889-28.444444 11.377778-39.822222 11.377778z"
                  fill="#14171A"
                />
              </svg>
            </div>
          )}

          <ScreeshotImg
            src={urls?.[showImgIndex]}
            isZoomOut
            onClick={closePictureViewer}
          />
        </ModalBody>
      </ModalBase>
    </ScreeshotsWrapper>
  );
}

const ScreeshotsWrapper = styled(Card)`
  width: 100%;
  height: 312px;
`;

const SliderWrapper = styled.div`
  width: 100%;
  margin-top: 20px;

  .slick-slide div {
    padding: 0 10px;
  }

  /* 设置 dots 容器样式 */
  .slick-dots {
    margin-top: 20px;
  }

  /* 设置每个 dot 的样式 */
  .slick-dots li {
    height: 4px;
  }

  /* 设置 dot 按钮的样式 */
  .slick-dots li button {
    margin: 0 auto;
    width: 8px;
    height: 4px;
    background: #718096;
    border-radius: 10px;
    padding: 0;
    transition: all 0.3s ease;
  }

  /* 隐藏默认的 dot 字符 */
  .slick-dots li button:before {
    display: none;
  }

  /* 设置激活状态的 dot 的样式 */
  .slick-dots li.slick-active button {
    width: 20px;
  }
`;

const ScreeshotImg = styled.img<{ isZoomOut?: boolean }>`
  width: 100%;
  height: 200px;
  border-radius: 10px;
  object-fit: cover;

  ${(props) =>
    props.isZoomOut
      ? `
    cursor: zoom-out;
    width: auto;
    height: auto;
    max-width: 1380px;
    max-height: 100%;

  `
      : `cursor: zoom-in;`}
`;

const ComingSoonImg = styled.img`
  width: 100%;
  margin-top: 20px;
`;

const ModalBody = styled(ModalBaseBody)`
  /* background: transparent; */
  background: #1b1e23;
  border-radius: 20px;
  margin-top: 12%;
  padding: 64px 20px 20px;
  position: relative;
  min-width: 800px;
  min-height: 700px;

  .icon {
    position: absolute;
    right: 26px;
    top: 26px;
    cursor: pointer;
  }

  .picture-viewer {
    width: 44px;
    height: 44px;
    background: #718096;
    border-radius: 36px;
    position: absolute;
    top: 50%;
    left: -50px;
    transform: translate(0, -50%);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .next {
    left: unset;
    right: -50px;
    background: #718096;
  }
  /* position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%); */
`;

export function ScreeshotsMobile({ urls, ...otherProps }: Props) {
  return (
    <ScreeshotsWrapperMobile {...otherProps}>
      <SectionTitle>Screeshots</SectionTitle>
      {/* <ComingSoonImg src={ComingSoonImgUrl} /> */}
      <ImgsWrapperMobile>
        {urls.map((url, index) => (
          <ScreeshotImg src={url} />
        ))}
      </ImgsWrapperMobile>
    </ScreeshotsWrapperMobile>
  );
}

const ScreeshotsWrapperMobile = styled.div`
  width: 100%;
`;
const ImgsWrapperMobile = styled.div`
  margin-top: 10px;
  width: 100%;
  height: 100px;
  /* padding: 0 10px; */
  overflow-x: auto;
  display: flex;
  column-gap: 15px;
  & > img {
    width: auto;
    height: 100%;
  }
`;
