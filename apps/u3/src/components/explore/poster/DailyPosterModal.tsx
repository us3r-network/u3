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
import PosterModalBtns from './PosterModalBtns';
import { captureScreenshot } from 'src/utils/shared/captureScreenshot';

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
    const genImg = async () => {
      setGenerating(true);
      try {
        console.time('is to canvas time:');
        const imgData = await captureScreenshot('posterLayout', {
          timeout: 400,
        });
        console.timeEnd('is to canvas time:');
        setPosterImg(imgData);
      } catch (error) {
        console.error('Error capturing screenshot:', error);
      } finally {
        setGenerating(false);
      }
    };

    if (open && !posterImg && !generating) {
      genImg();
    }
  }, [open, posterImg, generating]);

  return (
    <ModalBase isOpen={open}>
      <ModalBody>
        <PosterModalBtns
          shareDisabled={generating}
          posterImg={posterImg}
          onClose={closeModal}
        />
        {generating ? (
          <DailyPosterLayoutWrapperStyled>
            <Loading />
          </DailyPosterLayoutWrapperStyled>
        ) : (
          <PosterImg src={posterImg} />
        )}

        <DailyPosterLayout
          id="posterLayout"
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

  #posterLayout {
    position: fixed;
    right: 100%;
  }
`;
const DailyPosterLayoutWrapperStyled = styled(DailyPosterLayoutWrapper)`
  height: 80vh;
  background: none;
`;
const PosterImg = styled.img`
  width: 1440px;
`;
const CloseBtn = styled(ModalCloseBtn)`
  margin-left: auto;
`;
