import { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import Slider from 'react-slick';

import { useAppDispatch } from '../../store/hooks';
import Carousel from './Carousel';
import Today from './Today';

import { getTrendingContents } from '../../services/shared/api/home';
import { ContentListItem } from '../../services/news/types/contents';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const settings = {
  //   dots: true,
  infinite: true,
  autoplay: true,
  autoplaySpeed: 5000,
  arrows: false,
  dots: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  className: 'slides',
  dotsClass: 'slick-dots slick-thumb',
};

export default function Banner() {
  const [contents, setContents] = useState<Array<ContentListItem>>([]);

  const loadContents = useCallback(async () => {
    const { data } = await getTrendingContents();
    // 按总体分值排序
    const sortData = [...(data?.data || [])].sort((a, b) => {
      const aScore = Number(a?.upVoteNum) + Number(a?.editorScore);
      const bScore = Number(b?.upVoteNum) + Number(b?.editorScore);
      return bScore - aScore;
    });
    setContents(sortData);
  }, []);

  useEffect(() => {
    // setLoading(true);
    Promise.all([loadContents()]).finally(() => {
      //   setLoading(false);
    });
  }, []);

  return (
    <SliderWrapper>
      <Slider {...settings}>
        <Carousel />
        <Today contents={contents} />
      </Slider>
    </SliderWrapper>
  );
}
const SliderWrapper = styled.div`
  width: 100%;
  height: 300px;

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
