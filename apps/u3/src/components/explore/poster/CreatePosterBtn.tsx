import { ButtonPrimary } from 'src/components/common/button/ButtonBase';
import styled from 'styled-components';
import { useState } from 'react';
import loadable from '@loadable/component';
// import DailyPosterModal from './DailyPosterModal';
import { DailyPosterLayoutProps } from './layout/DailyPosterLayout';

const DailyPosterModal = loadable(() => import(`./DailyPosterModal`));

export default function CreatePosterBtn({
  disabled,
  ...layoutProps
}: DailyPosterLayoutProps & { disabled?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Wrapper
        id="createPosterBtn"
        disabled={disabled || !DailyPosterModal}
        onClick={() => setOpen(true)}
      >
        Create Poster
      </Wrapper>
      {DailyPosterModal && (
        <DailyPosterModal
          {...layoutProps}
          open={open}
          closeModal={() => setOpen(false)}
        />
      )}
    </>
  );
}

const Wrapper = styled(ButtonPrimary)`
  display: flex;
  width: 270px;
  height: 270px;
  justify-content: center;
  align-items: start;
  gap: 20px;

  border-radius: 50%;
  background: #f7f6f4;
  color: var(--14171-a, #14171a);
  box-shadow: 4px 10px rgba(0, 0, 0, 0.05);

  position: fixed;
  bottom: 0;
  right: 50%;
  transform: translate(56%, 200px);
  padding-top: 30px;
  box-sizing: border-box;

  leading-trim: both;
  text-edge: cap;
  font-family: Marion;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  z-index: 100;

  cursor: pointer;
  &:hover {
    width: 270px;
    height: 270px;
    background: #1b1e23;
    border: 1px solid #39424c;
    color: #fff;
  }
`;
