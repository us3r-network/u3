/* eslint-disable */
import styled from 'styled-components';
import { ModalCloseBtn } from '../../common/modal/ModalWidgets';
import DailyPosterLayout, {
  DailyPosterLayoutProps,
  DailyPosterLayoutWrapper,
} from './layout/DailyPosterLayout';
import ModalBase from '../../common/modal/ModalBase';
import Loading from 'src/components/common/loading/Loading';
import { useEffect, useState } from 'react';
import html2canvas from 'html2canvas-strengthen';
import PosterModalBtns from './PosterModalBtns';

type Props = DailyPosterLayoutProps & {
  open: boolean;
  closeModal: () => void;
  posterImg: string;
  setPosterImg: (url: string) => void;
};
export default function DailyPosterModal({
  posts,
  farcasterUserData,
  dapps,
  links,
  open,
  closeModal,
  posterImg,
  setPosterImg,
}: Props) {
  const [generating, setGenerating] = useState(false);
  useEffect(() => {
    const captureScreenshot = async () => {
      setGenerating(true);
      try {
        console.time('is to canvas time:');

        await new Promise((resolve) => setTimeout(resolve, 400));
        const el = document.getElementById('daily-poster-layout');
        const canvas = await html2canvas(el, {
          allowTaint: true,
          useCORS: true,
        });
        console.timeEnd('is to canvas time:');
        const imgData = canvas.toDataURL('image/png');
        setPosterImg(imgData);
      } catch (error) {
        console.error('Error capturing screenshot:', error);
      } finally {
        setGenerating(false);
      }
    };

    if (open && !posterImg && !generating) {
      captureScreenshot();
    }
  }, [open, posterImg, generating]);

  return (
    <ModalBase isOpen={open}>
      <ModalBody>
        <CloseBtn onClick={closeModal} />
        {generating ? (
          <DailyPosterLayoutWrapperStyled>
            <Loading />
          </DailyPosterLayoutWrapperStyled>
        ) : (
          <PosterImg src={posterImg} />
        )}
        <PosterModalBtns
          shareDisabled={generating}
          posterImg={posterImg}
          onClose={closeModal}
        />
        <DailyPosterLayout
          id="daily-poster-layout"
          posts={posts}
          farcasterUserData={farcasterUserData}
          dapps={dapps}
          links={links}
        />
      </ModalBody>
    </ModalBase>
  );
}

const ModalBody = styled.div`
  /* min-height: 194px; */
  flex-shrink: 0;

  padding: 20px;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  gap: 20px;
  background: #1b1e23;

  #daily-poster-layout {
    position: fixed;
    right: 100%;
  }
`;
const DailyPosterLayoutWrapperStyled = styled(DailyPosterLayoutWrapper)`
  height: 80vh;
`;
const PosterImg = styled.img`
  width: 1440px;
`;
const CloseBtn = styled(ModalCloseBtn)`
  margin-left: auto;
`;
