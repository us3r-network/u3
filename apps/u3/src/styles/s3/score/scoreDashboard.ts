import { css } from 'styled-components';

export default css`
  [data-us3r-component='ScoreDashboard'] {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    box-sizing: border-box;
    gap: 20px;

    width: 100%;
    height: 165px;

    background: #14171a;
    border-radius: 10px;
    [data-layout-element='ScoresAvgAndCount'] {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 12px;
      [data-state-element='ScoresAvg'] {
        display: flex;
        flex-direction: column;
        gap: 12px;
        [data-layout-element='AvgValue'] {
          font-style: italic;
          font-weight: 700;
          font-size: 40px;
          line-height: 47px;
          text-align: center;
          color: #ffffff;
          margin-right: 4px;
        }
        [data-layout-element='TotalValue'] {
          font-weight: 400;
          font-size: 16px;
          line-height: 19px;
          text-align: center;

          color: #718096;
        }
      }
      [data-state-element='ScoresCount'] {
        font-weight: 400;
        font-size: 14px;
        line-height: 17px;
        color: #718096;

        opacity: 0.8;
      }
    }
    [data-layout-element='DividingLine'] {
      width: 1px;
      height: 120px;
      background: #39424c;
      margin: 0 70px;
    }
    [data-layout-element='ScoreValuePercentages'] {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 10px;
      [data-state-element='ScoreValuePercentage'] {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      [data-layout-element='ScoreValue'] {
        width: 40px;
        font-weight: 400;
        font-size: 14px;
        line-height: 17px;
        color: #718096;

        opacity: 0.8;
      }
      [data-layout-element='ProgressBar'] {
        width: 300px;
        height: 10px;
        background: #1b1e23;
        border-radius: 12px;
      }
      [data-layout-element='ProgressFill'] {
        height: 10px;
        background: #cf9523;
        border-radius: 12px;
        transform: matrix(-1, 0, 0, 1, 0, 0);
      }

      [data-layout-element='ScorePercentage'] {
        width: 30px;
        font-weight: 400;
        font-size: 14px;
        line-height: 17px;
        text-align: right;
        color: #ffffff;

        opacity: 0.8;
      }
    }
  }
`;
