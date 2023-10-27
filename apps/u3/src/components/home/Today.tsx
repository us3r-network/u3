import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { MEDIA_BREAK_POINTS } from '../../constants';
import dailyPosterBg from '../common/assets/imgs/daily-poster.png';
import web3TodayBg from '../common/assets/imgs/web3-today.png';

import { useAppDispatch } from '../../store/hooks';
import { ContentListItem } from '../../services/news/types/contents';

export default function Today({
  contents,
}: {
  contents: Array<ContentListItem>;
}) {
  const navigate = useNavigate();

  return (
    <Box>
      <div className="flex items-center row imgBox">
        <img src={dailyPosterBg} alt="daily poster" />
        <img src={web3TodayBg} alt="web3 today" />
        {/* <h1 className="topic">Daily Poster</h1> */}
        {/* <div className="text sub-title">Web3 Today</div> */}
        <div
          className="viewBtn"
          onClick={() => {
            navigate(`/web3-today`);
            // navigate(`/contents/create?id=${data.id}`);
          }}
        >
          View
          <svg
            viewBox="0 0 1024 1024"
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
          >
            <path
              d="M951.127 483.716L668.284 200.873c-7.811-7.811-18.048-11.716-28.284-11.716-10.237 0-20.474 3.905-28.284 11.716-15.621 15.621-15.621 40.947 0 56.568L826.274 472H104c-22.092 0-40 17.908-40 40 0 22.091 17.908 40 40 40h722.274L611.716 766.559c-15.621 15.62-15.621 40.947 0 56.568 7.811 7.811 18.047 11.716 28.284 11.716 10.236 0 20.474-3.905 28.284-11.716l282.843-282.843c15.621-15.621 15.621-40.948 0-56.568z"
              fill="#e6e6e6"
            />
          </svg>
          {/* <svg
            viewBox="0 0 1024 1024"
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
          >
            <path
              d="M885.113 489.373L628.338 232.599c-12.496-12.497-32.758-12.497-45.254 0-12.497 12.497-12.497 32.758 0 45.255l203.3 203.3H158.025c-17.036 0-30.846 13.811-30.846 30.846 0 17.036 13.811 30.846 30.846 30.846h628.36L583.084 746.147c-12.497 12.496-12.497 32.758 0 45.255 6.248 6.248 14.438 9.372 22.627 9.372s16.379-3.124 22.627-9.372l256.775-256.775a31.999 31.999 0 0 0 0-45.254z"
              fill="#ffffff"
            />
          </svg> */}
        </div>
      </div>
      <div className="line-box">
        <div className="line" />
        <div className="line" />
      </div>
      <div className="contents">
        {contents?.slice(0, 3)?.map((content, index) => (
          <div
            key={content?.id}
            onClick={() => {
              navigate(`/contents/${content?.id}`);
            }}
          >
            <div className="title">{content?.title}</div>
            {content?.description && (
              <div className="desc">{content?.description}</div>
            )}
          </div>
        ))}
      </div>
    </Box>
  );
}

const Box = styled.div`
  width: 100%;
  /* max-height: 300px; */

  background: #f7f6f4;
  color: black;

  font-family: 'Marion';
  font-style: normal;
  padding: 33px 40px 44px;
  box-sizing: border-box;
  border-radius: 8px;
  height: 300px;

  .row {
    margin-bottom: 29px;
  }

  .topic {
    font-weight: 700;
    font-size: 60px;
    line-height: 84px;
    /* text-align: center; */
    font-style: normal;
    margin: 0;
  }

  .topic-h2 {
    font-size: 30px;
    line-height: 50px;

    text-align: center;

    margin-bottom: 20px;
  }

  .imgBox {
    img:first-of-type {
      width: 434px;
    }
    img:last-of-type {
      width: 216px;
      margin-left: 40px;
      margin-bottom: -10px;
    }
  }

  .sub-title {
    font-family: 'Snell Roundhand';
    /* font-style: italic; */
    font-weight: 700;
    font-size: 40px;
    line-height: 50px;
    margin-left: 50px;
    margin-bottom: -10px;
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

  .viewBtn {
    /* width: 193px; */
    height: 66px;
    text-align: center;
    line-height: 66px;
    color: white;

    background: #14171a;
    border-radius: 40px;

    font-family: 'Marion';
    font-style: normal;
    font-weight: 700;
    font-size: 30px;
    color: #f7f6f4;
    padding: 0 40px 0 46px;

    cursor: pointer;
    margin-left: auto;
    display: flex;
    /* justify-content: space-around; */
    align-items: center;
    svg {
      margin-left: 10px;
    }
  }

  .line {
    height: 4px;
    background: black;
    &:last-child {
      margin-top: 4px;
    }
  }

  .contents {
    position: relative;
    display: flex;
    column-gap: 30px;
    align-items: center;
    justify-content: space-between;

    padding-top: 30px;
    & > div {
      width: 0;
      flex: 1;
      border-bottom: 1px solid white;
      cursor: pointer;
      &:last-child {
        border: none;
      }
      &:hover {
        .title,
        .desc {
          text-decoration: underline;
        }
      }
    }

    &::before {
      content: '';
      width: 1px;
      height: calc(100% - 30px);
      background: black;
      position: absolute;
      top: 30px;
      left: 33%;
      /* transform: translate(0, -50%); */
    }
    &::after {
      content: '';
      width: 1px;
      height: calc(100% - 30px);
      background: black;
      position: absolute;
      top: 30px;
      left: 67%;
      /* transform: translate(0, -50%); */
    }
  }

  .title {
    font-weight: 700;
    font-size: 20px;
    line-height: 21px;
    overflow: hidden;
    /* white-space: nowrap; */
    display: -webkit-box;

    -webkit-box-orient: vertical;
    -webkit-box-pack: center;
    -webkit-box-align: center;
    box-pack: center;
    box-align: center;

    -webkit-line-clamp: 2;
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
