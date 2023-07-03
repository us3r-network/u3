import { css } from 'styled-components';
import { InputBaseCss } from '../../../components/common/input/InputBase';
import { ButtonPrimaryLineCss } from '../../../components/common/button/ButtonBase';

export default css`
  [data-us3r-component='CommentAddForm'] {
    [data-layout-element='FormBox'] {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      box-sizing: border-box;
      gap: 20px;

      background: #14171a;
      border: 1px solid #39424c;
      border-radius: 10px;
    }

    [data-state-element='TextInput'] {
      ${InputBaseCss}
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;
      flex-grow: 1;
      background: none;
      border: none;
      outline: none;
      color: #fff;
    }
    [data-state-element='SubmitButton'] {
      ${ButtonPrimaryLineCss}
      background: none;
      display: flex;
      align-items: center;
      padding: 6px 8px;
      gap: 4px;
      width: 95px;
      height: 32px;

      background: #1a1e23;
      border: 1px solid #39424c;
      border-radius: 12px;

      > span {
        font-weight: 400;
        font-size: 12px;
        line-height: 14px;
        text-align: center;

        color: #718096;
      }
    }

    [data-state-element='ErrorMessage'] {
      color: red;
    }
  }
`;
