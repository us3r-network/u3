import { css } from 'styled-components';

export default css`
  [data-us3r-component='UserAvatar'] {
    display: inline-block;
    width: 32px;
    height: 32px;
    & > img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
`;
