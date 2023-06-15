import { css } from 'styled-components';
import { isMobile } from 'react-device-detect';
import { ButtonPrimaryLineCss } from '../../../components/common/button/ButtonBase';

export default css`
  [data-us3r-component='ScoreReviews'] {
    [data-layout-element='CompositeWrap'] {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    [data-layout-element='RatingAndReviewWrapButton'] {
      ${ButtonPrimaryLineCss}
      width: 100%;
      justify-content: space-between;

      [data-layout-element='Label'] {
        display: flex;
        align-items: center;
        gap: 10px;
        [data-layout-element='Icon'] {
          width: 20px;
          height: 20px;
          fill: #718096;
        }
      }
    }

    [data-state-element='List'] {
      display: grid;
      grid-gap: 20px;
      grid-template-columns: repeat(auto-fit, minmax(282px, 1fr));
      ${isMobile && 'grid-template-columns: 1fr;'}

      [data-state-element='Item'] {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 20px;
        box-sizing: border-box;
        gap: 20px;
        background: #14171a;
        border-radius: 10px;
        color: #718096;

        ${isMobile &&
        `
          background: #1B1E23;
          border: 1px solid #39424C;
          border-radius: 10px;
        `}
      }
      [data-layout-element='ScoreValueWrap'] {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        [data-layout-element='EditButton'] {
          all: unset;
          display: none;
          align-items: center;
          gap: 2px;
          cursor: pointer;
          [data-layout-element='Icon'] {
            width: 20px;
            height: 20px;
            fill: #718096;
          }
        }
      }

      [data-state-element='Text'] {
        display: inline-block;
        height: 50px;
        font-weight: 400;
        font-size: 14px;
        line-height: 17px;
      }

      [data-layout-element='UserInfo'] {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 10px;
        ${isMobile &&
        `
          width: 100%;
          border-top: 1px solid #39424C;
          padding-top: 10px;
        `}
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
        [data-us3r-component='UserName'] {
          font-weight: 500;
          font-size: 16px;
          line-height: 19px;
          color: #ffffff;
        }
      }
    }
  }
`;
