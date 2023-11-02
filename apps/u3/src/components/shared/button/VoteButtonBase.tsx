import { VoteButton } from '@us3r-network/link';
import styled from 'styled-components';
import { ButtonPrimaryLineCss } from '../../common/button/ButtonBase';

export const VoteButtonBase = styled(VoteButton)`
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
`;
