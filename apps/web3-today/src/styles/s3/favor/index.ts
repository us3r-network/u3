import { css } from 'styled-components';
import { ButtonPrimaryLineCss } from '../../../components/common/button/ButtonBase';

export default css`
  [data-us3r-component='FavorButton'] {
    ${ButtonPrimaryLineCss}
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 18px;
    padding: 12px;
    box-sizing: border-box;
    svg {
      fill: #fff;
    }
    span {
      color: #fff;
    }
  }
`;
