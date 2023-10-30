import { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { TopicItem } from '../../features/shared/topics';
import { ContentLang } from '../../services/news/types/contents';
import { ButtonPrimary } from '../common/button/ButtonBase';

export type ItemData = {
  type: string;
} & TopicItem;
export default function OnBoard({
  lists,
  finishAction,
}: {
  lists: Array<ItemData>;
  finishAction: (data: { tags: string[]; langs: string[] }) => void;
}) {
  const [selectFeeds, setSelectFeeds] = useState([]);
  const [lang, setLang] = useState([ContentLang.English, ContentLang.中文]);

  const selectFeedsHandler = useCallback(
    (item: string) => {
      const idx = selectFeeds.findIndex((data) => data === item);
      if (idx !== -1) {
        setSelectFeeds([
          ...selectFeeds.slice(0, idx),
          ...selectFeeds.slice(idx + 1),
        ]);
      } else {
        setSelectFeeds([...selectFeeds, item]);
      }
    },
    [selectFeeds]
  );

  const finishHandler = useCallback(() => {
    finishAction({
      tags: [...selectFeeds],
      langs: lang,
    });
  }, [selectFeeds, lists, lang]);

  const uiList = useMemo(() => {
    const data = new Set(lists.map((item) => item.name));
    return new Array(...data);
  }, [lists]);

  return (
    <OnBoardBox>
      <div>
        <img src="/logo192.png" alt="" />
        <h2>Welcome to U3!</h2>
        <p>Pick your favorite topics to set up your feeds.</p>
        <div className="feed-list">
          {uiList.map((item) => {
            const hasSelect = selectFeeds.includes(item);
            return (
              <div
                key={item}
                onClick={() => {
                  selectFeedsHandler(item);
                }}
                className={hasSelect ? 'selected' : ''}
              >
                {item}
              </div>
            );
          })}
        </div>
        <p>Choose your preferred languages.</p>
        <div className="lang">
          <div>
            <input
              title="en"
              type="checkbox"
              checked={lang.includes(ContentLang.English)}
              onChange={(e) => {
                const langSet = new Set(lang);
                if (e.target.checked) {
                  langSet.add(ContentLang.English);
                } else {
                  langSet.delete(ContentLang.English);
                }
                setLang([...langSet]);
              }}
            />
            <span>English</span>
          </div>
          <div>
            <input
              title="zh"
              type="checkbox"
              checked={lang.includes(ContentLang.中文)}
              onChange={(e) => {
                const langSet = new Set(lang);
                if (e.target.checked) {
                  langSet.add(ContentLang.中文);
                } else {
                  langSet.delete(ContentLang.中文);
                }
                setLang([...langSet]);
              }}
            />
            <span>中文</span>
          </div>
        </div>
        <div className="btn">
          <FinishBtn onClick={finishHandler}>Finish</FinishBtn>
        </div>
      </div>
    </OnBoardBox>
  );
}

const OnBoardBox = styled.div`
  height: 100%;
  width: 100%;
  overflow: scroll;
  > div {
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
    background: #1b1e23;
    border-radius: 20px;
    height: calc(100vh - 80px);
    position: relative;
    padding: 40px;
    box-sizing: border-box;
    overflow: scroll;

    > img {
      width: 55px;
      height: 50px;
    }

    > h2 {
      margin: 0;
      margin-bottom: 20px;
      font-weight: 700;
      font-size: 36px;
      line-height: 40px;

      color: #ffffff;
    }

    > p {
      font-weight: 400;
      font-size: 16px;
      line-height: 19px;
      text-align: center;
      color: #718096;
      margin: 0;
    }

    > .feed-list {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
      justify-content: center;
      margin-bottom: 20px;
      max-width: 760px;

      > div {
        cursor: pointer;
        width: 108px;
        height: 48px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #1a1e23;
        border: 1px solid #39424c;
        border-radius: 12px;

        font-weight: 500;
        font-size: 16px;
        line-height: 16px;
        color: #718096;
        text-align: center;
        &.selected {
          background: linear-gradient(52.42deg, #cd62ff 35.31%, #62aaff 89.64%);
          color: #1b1e23;
        }
      }
    }

    > .lang {
      display: flex;
      gap: 50px;
      > div {
        color: #ffffff;
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 400;
        font-size: 16px;
        line-height: 24px;
      }
    }

    > .btn {
      margin-top: 30px;
    }
  }
`;

const FinishBtn = styled(ButtonPrimary)`
  width: 228px;
  height: 48px;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
`;
