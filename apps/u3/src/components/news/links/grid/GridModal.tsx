/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-11-13 18:36:30
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-11-17 16:50:45
 * @FilePath: /u3/apps/u3/src/components/news/links/grid/GridModal.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import Modal from 'react-modal';
import styled from 'styled-components';
import { LinkListItem } from 'src/services/news/types/links';
import { Close } from '../../../common/icons/close';
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
    <Modal
      isOpen={show}
      style={{
        overlay: {
          backgroundColor: 'rgba(0,0,0,0.3)',
          zIndex: 200,
          backdropFilter: 'blur(12px)',
        },
        content: {
          display: 'flex',
          alignItems: 'center',
          margin: '0 auto',
          background: 'none',
          border: 'none',
        },
      }}
    >
      <ContentBox>
        {data && (
          <LinkPreview data={data}>
            <CloseButton onClick={closeModal}>
              <Close />
            </CloseButton>
          </LinkPreview>
        )}
      </ContentBox>
    </Modal>
  );
}

const ContentBox = styled.div`
  margin: 0 auto;
  text-align: start;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 982px;
  height: 100%;

  background: #1b1e23;
  border-radius: 20px;
  padding: 20px;
  box-sizing: border-box;
`;
const CloseButton = styled.div`
  cursor: pointer;
  padding: 10px;
`;
