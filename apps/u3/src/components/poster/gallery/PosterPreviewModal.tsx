import dayjs from 'dayjs';
import DailyPosterLayout, {
  DailyPosterLayoutData,
} from '../layout/DailyPosterLayout';
import ModalBase from '../../common/modal/ModalBase';
import { ModalCloseBtn } from '@/components/common/modal/ModalWidgets';

type Props = {
  createAt: number;
  posterImg: string;
  posterData: DailyPosterLayoutData;
  open: boolean;
  closeModal: () => void;
};
export default function PosterPreviewModal({
  createAt,
  posterImg,
  posterData,
  open,
  closeModal,
}: Props) {
  const { posts, farcasterUserData, topics, dapps, links } = posterData || {};
  const hasData = posterData && posts?.length;
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
          bg-[#1b1e23]
        "
      >
        <div className="mb-[20px] flex justify-between items-center">
          <span className="text-white text-[16px] italic font-bold leading-[normal]">
            {dayjs(createAt).format('MMMM DD, YYYY')}
            {hasData && ' - ( Click on the link in the view to view details )'}
          </span>
          <ModalCloseBtn onClick={closeModal} />
        </div>
        {hasData ? (
          <DailyPosterLayout
            posts={posts}
            farcasterUserData={farcasterUserData}
            topics={topics}
            dapps={dapps}
            links={links}
            createAt={createAt}
          />
        ) : (
          <img src={posterImg} alt="" className="w-[560px] object-cover" />
        )}
      </div>
    </ModalBase>
  );
}
