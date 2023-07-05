import { css } from 'styled-components';
import { ButtonPrimaryLineCss } from '../../../components/common/button/ButtonBase';

export default css`
  [data-us3r-component='Comments'] {
    [data-layout-element='Btns'] {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 20px;
      > * {
        ${ButtonPrimaryLineCss}
        padding: 0;
        width: 194px;
        height: 32px;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 18px;
        padding: 12px;
        box-sizing: border-box;
        color: #fff;
        svg {
          fill: #fff;
        }
      }
    }

    [data-us3r-component='CommentAddForm'] {
      margin-top: 20px;
    }
    [data-state-element='List'] {
      margin-top: 20px;
      display: flex;
      flex-direction: column;
      background: #1b1e23;
      [data-state-element='Item'] {
        padding: 10px;
        margin-top: 10px;
        border-bottom: 1px solid #39424c;
        color: #fff;
        font-weight: 500;
        font-size: 16px;
        line-height: 19px;
        [data-layout-element='UserInfo'] {
          display: flex;
          align-items: center;
          gap: 10px;

          [data-us3r-component='UserAvatar'] {
            width: 48px;
            height: 48px;
          }

          [data-layout-element='NameAndDate'] {
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
        }
        [data-state-element='Text'] {
          display: inline-block;
          font-weight: 400;
          font-size: 14px;
          line-height: 17px;
          margin-top: 10px;
        }
      }
    }
  }
`;
