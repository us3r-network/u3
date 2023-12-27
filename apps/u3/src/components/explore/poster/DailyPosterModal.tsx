/* eslint-disable */
import styled from 'styled-components';
import DailyPosterLayout, {
  DailyPosterLayoutProps,
} from './layout/DailyPosterLayout';
import ModalBase from '../../common/modal/ModalBase';
import PosterModalBtns from './PosterModalBtns';
import { API_BASE_URL } from '@/constants';
import SubscribePosterForm from './SubscribePosterForm';

type Props = DailyPosterLayoutProps & {
  open: boolean;
  closeModal: () => void;
};
const posterImg = `${API_BASE_URL}/static-assets/poster/poster.webp`;

export default function DailyPosterModal({
  posts,
  farcasterUserData,
  topics,
  dapps,
  links,
  open,
  closeModal,
}: Props) {
  return (
    <ModalBase isOpen={open}>
      <ModalBody>
        <PosterModalBtns posterImg={posterImg} onClose={closeModal} />
        <PosterImg src={posterImg} />
        <SubscribePosterForm />

        <DailyPosterLayout
          id="posterLayout"
          posts={posts}
          farcasterUserData={farcasterUserData}
          topics={topics}
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
const PosterImg = styled.img`
  width: 1440px;
`;
