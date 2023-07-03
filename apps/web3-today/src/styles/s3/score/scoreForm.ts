import { css } from 'styled-components';
import { ButtonPrimaryCss } from '../../../components/common/button/ButtonBase';
import { TextareaBaseCss } from '../../../components/common/input/TextareaBase';

export default css`
  [data-us3r-component='ScoreForm'] {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    [data-us3r-component='UserAvatar'] {
      width: 120px;
      height: 120px;
    }
    [data-state-element='CommentTextarea'] {
      ${TextareaBaseCss}
    }
    [data-state-element='SubmitButton'] {
      ${ButtonPrimaryCss}
      width: 100%;
    }
  }
`;
