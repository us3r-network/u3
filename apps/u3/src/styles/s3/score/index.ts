import { css } from 'styled-components';
import scoresAvg from './scoresAvg';
import scoreDashboard from './scoreDashboard';
import scoreForm from './scoreForm';
import scoreReviews from './scoreReviews';

const star = css`
  [data-common-element='ActivatedStarIcon'] {
    fill: #cf9523;
  }
  [data-common-element='InactivatedStarIcon'] {
    fill: #718096;
  }
`;

export default css`
  ${star}
  ${scoresAvg}
  ${scoreDashboard}
  ${scoreForm}
${scoreReviews}
`;
