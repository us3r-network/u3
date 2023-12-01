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
    color: #fff;

    /* Bold Italic-24 */
    font-family: Rubik;
    font-size: 24px;
    font-style: italic;
    font-weight: 700;
    line-height: normal;
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
