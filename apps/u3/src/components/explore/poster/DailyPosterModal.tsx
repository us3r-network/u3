/* eslint-disable */
import styled from 'styled-components';
import { ModalCloseBtn } from '../../common/modal/ModalWidgets';
import DailyPosterLayout, {
  DailyPosterLayoutProps,
} from './layout/DailyPosterLayout';
import ModalBase from '../../common/modal/ModalBase';
import PosterShareBtns from './PosterShareBtns';

type Props = DailyPosterLayoutProps & {
  open: boolean;
  closeModal: () => void;
  posterUrl: string;
  setPosterUrl: (url: string) => void;
};
export default function DailyPosterModal({
  posts,
  farcasterUserData,
  dapps,
  links,
  open,
  closeModal,
  posterUrl,
  setPosterUrl,
}: Props) {
  return (
    <ModalBase isOpen={open}>
      <ModalBody>
        <CloseBtn onClick={closeModal} />
        <DailyPosterLayout
          id="daily-poster-layout"
          posts={posts}
          farcasterUserData={farcasterUserData}
          dapps={dapps}
          links={links}
        />
        <PosterShareBtns
          targetId="daily-poster-layout"
          posterUrl={posterUrl}
          setPosterUrl={setPosterUrl}
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
`;
const CloseBtn = styled(ModalCloseBtn)`
  margin-left: auto;
`;
