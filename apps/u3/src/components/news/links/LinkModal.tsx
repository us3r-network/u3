import { LinkListItem } from 'src/services/news/types/links';
import ModalContainer from 'src/components/common/modal/ModalContainer';
import { ModalCloseBtn } from 'src/components/common/modal/ModalWidgets';
import LinkPreview from './LinkPreview';

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
      <div className="mx-[auto] my-[0] w-[982px] h-[90vh]  bg-[#1b1e23] rounded-[20px] p-[20px] box-border">
        {data && <LinkPreview data={data} />}
        <ModalCloseBtn
          className="absolute top-[20px] right-[20px]"
          onClick={closeModal}
        />
      </div>
    </ModalContainer>
  );
}
