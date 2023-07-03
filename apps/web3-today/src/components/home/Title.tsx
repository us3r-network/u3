import styled from 'styled-components';

export default function Title({
  text,
  viewAllAction,
}: {
  text: string;
  viewAllAction?: () => void;
}) {
  return (
    <Box>
      <span>{text}</span>
      {viewAllAction && (
        <button type="button" onClick={viewAllAction}>
          View All
        </button>
      )}
    </Box>
  );
}

const Box = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  > span {
    font-style: italic;
    font-weight: 700;
    font-size: 24px;
    line-height: 28px;

    color: #ffffff;
  }

  > button {
    outline: none;
    border: none;
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
    background-color: inherit;
    cursor: pointer;
    text-align: center;

    color: #718096;
  }
`;
