import { LinkListItem } from 'src/services/news/types/links';
import ModalContainer from 'src/components/common/modal/ModalContainer';
import { ModalCloseBtn } from 'src/components/common/modal/ModalWidgets';
import LinkPreview from './LinkPreview';
import { cn } from '@/lib/utils';

export default function LinkModal({
  show,
  closeModal,
  data,
}: {
  show: boolean;
  closeModal: () => void;
  data: LinkListItem | null;
}) {
  return (
    <ModalContainer open={show} closeModal={closeModal}>
      <div
        className={cn(
          'mx-[auto] my-[0] w-[982px] h-[90vh]  bg-[#1b1e23] rounded-[20px] p-[20px] box-border',
          'max-sm:w-[100vw] max-sm:p-[0px] max-sm:pt-[30px]'
        )}
      >
        {data && <LinkPreview data={data} />}
        <ModalCloseBtn
          className={cn(
            'absolute top-[20px] right-[20px]',
            'max-sm:top-[10px] max-sm:right-[10px]'
          )}
          onClick={closeModal}
        />
      </div>
    </ModalContainer>
  );
}
