import styled from 'styled-components';
import { Atom2 } from '../icons/atom';

export default function Karma({
  score,
  clickAction,
}: {
  score: string;
  clickAction?: () => void;
}) {
  return (
    <Box className="karma" onClick={() => clickAction && clickAction()}>
      <Atom2 />
      <span>U Karma</span>
      <span className="score">{score}</span>
    </Box>
  );
}

const Box = styled.div`
  padding: 2px 12px;
  gap: 4px;
  /* height: 23px; */
  display: flex;
  align-items: center;
  background: linear-gradient(52.42deg, #cd62ff 35.31%, #62aaff 89.64%);
  border-radius: 22px;
  cursor: pointer;

  & span {
    font-weight: 500;
    font-size: 16px;
    line-height: 19px;

    &.score {
      font-weight: 400;
    }
  }
`;
