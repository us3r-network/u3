import styled from 'styled-components';
import { CircleDown } from '../../icons/circle-down';
import { CircleUp } from '../../icons/circle-up';

export default function Title({
  name,
  expand,
  setExpand,
  exploreAction,
}: {
  name: string;
  expand: boolean;
  setExpand: (arg0: boolean) => void;
  exploreAction: () => void;
}) {
  return (
    <TitleBox>
      <span>{name}</span>
      <div className="expand-box">
        <button
          type="button"
          onClick={() => {
            exploreAction();
          }}
        >
          Explore More
        </button>
        <span>|</span>
        <button
          type="button"
          onClick={() => {
            setExpand(!expand);
          }}
        >
          {!expand ? <CircleDown /> : <CircleUp />}
        </button>
      </div>
    </TitleBox>
  );
}

const TitleBox = styled.div`
  display: flex;
  justify-content: space-between;
  height: 28px;

  & > span {
    font-style: italic;
    font-weight: 700;
    font-size: 24px;
    line-height: 28px;

    color: #ffffff;
  }

  & > div {
    color: #748094;
    display: flex;
    align-items: center;
    gap: 10px;
    & button {
      cursor: pointer;
      font-weight: 400;
      font-size: 16px;
      line-height: 19px;
      color: inherit;
      border: none;
      outline: none;
      background-color: inherit;
      & svg {
        vertical-align: middle;
      }
    }
  }
`;
