import DailyPosterLayout, {
  DailyPosterLayoutProps,
} from './layout/DailyPosterLayout';
import ModalBase from '../../common/modal/ModalBase';
import { API_BASE_URL } from '@/constants';
import { ModalCloseBtn } from '@/components/common/modal/ModalWidgets';
import PosterShare from './PosterShare';

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
    <ModalBase
      isOpen={open}
      style={{
        content: {
          inset: '115px',
        },
        overlay: {
          zIndex: 30,
        },
      }}
    >
      <div
        className="
          flex-shrink-0
          p-[20px]
          box-border
          flex
          gap-[20px]
          bg-[#1b1e23]
        "
      >
        <img src={posterImg} alt="" className="w-[560px] object-cover" />
        <DailyPosterLayout
          id="posterLayout"
          posts={posts}
          farcasterUserData={farcasterUserData}
          topics={topics}
          dapps={dapps}
          links={links}
          className="fixed right-full"
        />
        <div className="w-[310px] flex flex-col gap-[20px]">
          <div className="flex justify-between items-center">
            <h1 className="text-[#FFF] text-[40px] font-bold leading-none">
              U3 Caster
            </h1>
            <ModalCloseBtn onClick={closeModal} />
          </div>
          <PosterShare posterImg={posterImg} />
        </div>
      </div>
    </ModalBase>
  );
}
