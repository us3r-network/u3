import { isMobile } from 'react-device-detect';
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
          {isMobile ? <ArrowRight /> : 'View All'}
        </button>
      )}
    </Box>
  );
}
function ArrowRight() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="21"
      viewBox="0 0 20 21"
      fill="none"
    >
      <path
        d="M10 13.5833L13.3333 10.25M13.3333 10.25L10 6.91666M13.3333 10.25H6.66667M18.3333 10.25C18.3333 14.8524 14.6024 18.5833 10 18.5833C5.39763 18.5833 1.66667 14.8524 1.66667 10.25C1.66667 5.64762 5.39763 1.91666 10 1.91666C14.6024 1.91666 18.3333 5.64762 18.3333 10.25Z"
        stroke="#718096"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
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
