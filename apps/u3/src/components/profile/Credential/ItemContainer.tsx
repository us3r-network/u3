import styled from 'styled-components';
import { MEDIA_BREAK_POINTS } from '../../../constants';

export const ContentBox = styled.div`
  margin-top: 40px;
  background: #1b1e23;
  border-radius: 20px;
  padding: 20px;
  .data {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-top: 20px;
    /* height: 258px; */
  }

  @media (max-width: ${MEDIA_BREAK_POINTS.xxxl}px) {
  }
  @media (min-width: ${MEDIA_BREAK_POINTS.xxxl}px) {
  }
`;
