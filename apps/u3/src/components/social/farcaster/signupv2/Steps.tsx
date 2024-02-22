import Checked from 'src/components/common/icons/checked';
import Unchecked from 'src/components/common/icons/unchecked';
import styled from 'styled-components';

export function StyledTitle({
  checked,
  text,
}: {
  checked: boolean;
  text: string;
}) {
  return (
    <StyledTitleBox>
      {checked ? <Checked /> : <Unchecked />}
      <h1>{text}</h1>
    </StyledTitleBox>
  );
}

const StyledTitleBox = styled.h1`
  display: flex;
  gap: 20px;
  align-items: center;
  margin: 0;
  > h1 {
    margin: 0;
    padding: 0;
    color: #fff;
    font-family: Rubik;
    font-size: 32px;
    font-style: italic;
    font-weight: 700;
    line-height: normal;

    background: #454c99;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    width: 100%;
  }
`;

export const StyledDescription = styled.p`
  color: #fff;
  font-family: Rubik;
  font-size: 20px;
  font-style: italic;
  font-weight: 700;
  line-height: normal;
  padding: 0;
  margin: 20px 0;
`;

export const StepsBox = styled.div`
  display: flex;
  flex-direction: column;

  hr {
    width: 100%;
    background-color: inherit;
    border: none;
    border-top: 1px solid rgba(57, 66, 76, 0.5);
    margin-bottom: 20px;
  }
`;

export const StyledData = styled.div`
  color: #fff;
  font-family: Rubik;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 40px;
  display: flex;
  flex-grow: 1;

  flex-direction: column;
  justify-content: space-between;

  p {
    margin: 0;
    padding: 0;
  }
`;

export const StyledSpan = styled.span`
  margin: 0;
  color: #fff;
  font-family: Rubik;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 40px;
`;

export const StyledOps = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;

  input {
    background: #1a1e23;
    outline: none;
    border: 1px solid #39424c;
    border-radius: 12px;
    height: 48px;
    padding: 0px 10px;
    color: #ffffff;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    box-sizing: border-box;
    min-width: 100px;
  }
  > button {
    display: flex;
    padding: 12px 24px;
    height: 48px;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    background: #fff;
    color: #000;
    text-align: center;
    border: none;
    outline: none;
    cursor: pointer;

    /* Text/Medium 16pt · 1rem */
    font-family: Rubik;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px; /* 150% */
  }
`;
