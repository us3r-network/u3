import styled from 'styled-components';
import { CHROME_EXTENSION_URL } from '../../constants';
import { Chrome } from '../common/icons/chrome';

export default function ExtensionSupport({
  url,
  title,
  img,
  msg,
  btns,
}: {
  url: string;
  title: string;
  img?: string;
  msg?: string;
  btns?: boolean;
}) {
  return (
    <Box>
      {img && <img title="extension" src={img} alt="" />}
      <h2>{title}</h2>
      <p>
        {msg ||
          `Sorry, this website has disabled embedding. Please try our Chrome
        extension for free toss the content displayed here.`}
      </p>
      {btns && (
        <div className="btns">
          <button
            type="button"
            onClick={() => {
              window.open(url, '_blank');
            }}
          >
            Open in new tab
          </button>
          <button
            type="button"
            className="chrome"
            onClick={() => {
              if (CHROME_EXTENSION_URL)
                window.open(CHROME_EXTENSION_URL, '_blank');
              else alert('TODO');
            }}
          >
            <Chrome /> Install U3 on Chrome
          </button>
        </div>
      )}
    </Box>
  );
}

const Box = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;

  & img {
    width: 120px;
    border-radius: 50%;
    height: 120px;
  }

  > h2 {
    font-style: italic;
    font-weight: 700;
    font-size: 24px;
    line-height: 28px;
    color: #ffffff;
    margin: 20px 0;
  }

  > p {
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
    text-align: center;
    width: 80%;
    margin: 0 0 20px 0;
    color: #748094;
  }

  .btns {
    display: flex;
    align-items: center;
    gap: 20px;
    > button {
      width: 179px;
      height: 48px;
      background: #1a1e23;
      border: 1px solid #39424c;
      border-radius: 12px;
      font-weight: 500;
      font-size: 16px;
      line-height: 24px;

      text-align: center;

      color: #718096;

      &.chrome {
        width: 245px;
        height: 48px;

        background: #ffffff;
        border-radius: 12px;
        color: #14171a;
        & svg {
          vertical-align: middle;
          margin-right: 5px;
        }
      }
    }
  }
`;
