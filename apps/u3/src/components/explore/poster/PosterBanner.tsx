import { ButtonPrimary } from 'src/components/common/button/ButtonBase';
import styled from 'styled-components';
import { useState } from 'react';
import loadable from '@loadable/component';
// import DailyPosterModal from './DailyPosterModal';
import { DailyPosterLayoutProps } from './layout/DailyPosterLayout';

const DailyPosterModal = loadable(() => import(`./DailyPosterModal`));

export default function PosterBanner({
  disabled,
  ...layoutProps
}: DailyPosterLayoutProps & { disabled?: boolean }) {
  const [open, setOpen] = useState(false);
  const [posterUrl, setPosterUrl] = useState('');
  return (
    <Wrapper>
      <PrimaryTitle>Daily Poster</PrimaryTitle>
      <SecondaryTitle>Web3 Today</SecondaryTitle>
      <CreatePosterBtn
        disabled={disabled || !DailyPosterModal}
        onClick={() => setOpen(true)}
      >
        Create Poster <ArrowRight />
      </CreatePosterBtn>
      {DailyPosterModal && (
        <DailyPosterModal
          {...layoutProps}
          posterUrl={posterUrl}
          setPosterUrl={setPosterUrl}
          open={open}
          closeModal={() => setOpen(false)}
        />
      )}
    </Wrapper>
  );
}
function ArrowRight() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M2 10.5C1.17157 10.5 0.5 11.1716 0.5 12C0.5 12.8284 1.17157 13.5 2 13.5V10.5ZM23.0607 13.0607C23.6464 12.4749 23.6464 11.5251 23.0607 10.9393L13.5147 1.3934C12.9289 0.807611 11.9792 0.807611 11.3934 1.3934C10.8076 1.97919 10.8076 2.92893 11.3934 3.51472L19.8787 12L11.3934 20.4853C10.8076 21.0711 10.8076 22.0208 11.3934 22.6066C11.9792 23.1924 12.9289 23.1924 13.5147 22.6066L23.0607 13.0607ZM2 13.5H22V10.5H2V13.5Z"
        fill="#F7F6F4"
      />
    </svg>
  );
}
const Wrapper = styled.div`
  display: flex;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  gap: 40px;
  align-items: center;
  border-radius: 20px;
  background: #f7f6f4;
`;
const PrimaryTitle = styled.span`
  color: var(--14171-a, #14171a);
  font-family: Marion;
  font-size: 80px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;
const SecondaryTitle = styled.span`
  color: var(--14171-a, #14171a);
  font-family: Snell Roundhand;
  font-size: 40px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;
const CreatePosterBtn = styled(ButtonPrimary)`
  margin-left: auto;
  display: flex;
  min-width: 295px;
  height: 70px;
  padding: 25px 40px;
  align-items: center;
  gap: 20px;
  border-radius: 60px;
  background: #0c0c0b;

  color: #f7f6f4;
  leading-trim: both;
  text-edge: cap;
  font-family: Marion;
  font-size: 30px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;
