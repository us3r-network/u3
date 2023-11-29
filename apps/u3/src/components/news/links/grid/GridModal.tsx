/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-11-13 18:36:30
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-11-29 16:25:51
 * @FilePath: /u3/apps/u3/src/components/news/links/grid/GridModal.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import styled from 'styled-components';
import { LinkListItem } from 'src/services/news/types/links';
import ModalContainer from 'src/components/common/modal/ModalContainer';
import { ModalCloseBtn } from 'src/components/common/modal/ModalWidgets';
import LinkPreview from '../LinkPreview';

export default function GridModal({
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
      <ModalBody>
        {data && <LinkPreview data={data} />}
        <CloseBtn onClick={closeModal} />
      </ModalBody>
    </ModalContainer>
  );
}

const ModalBody = styled.div`
  margin: 0 auto;
  display: relative;
  width: 982px;
  height: 90vh;

  background: #1b1e23;
  border-radius: 20px;
  padding: 20px;
  box-sizing: border-box;
`;
const CloseBtn = styled(ModalCloseBtn)`
  position: absolute;
  top: 20px;
  right: 20px;
`;
