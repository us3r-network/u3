/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-11-27 16:23:31
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-11-27 17:24:18
 * @FilePath: /u3/apps/u3/src/components/shared/share/MultiPlatformCommentModal.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import styled from 'styled-components';
import { isMobile } from 'react-device-detect';

import { SocialPlatform } from 'src/services/social/types';
import ModalContainer from '../../common/modal/ModalContainer';
import { ModalCloseBtn } from '../../common/modal/ModalWidgets';
import AddPostForm from '../../social/AddPostForm';
import { useGlobalModalsCtx } from '../../../contexts/shared/GlobalModalsCtx';

export default function MultiPlatformCommentModal({
  open,
  closeModal,
}: {
  open: boolean;
  closeModal: () => void;
}) {
  const { commentLinkModalState } = useGlobalModalsCtx();
  const embedLink = [{ url: commentLinkModalState?.link }];
  return (
    <ModalContainer
      open={open}
      closeModal={closeModal}
      zIndex={300}
      contentTop="30%"
    >
      <ModalBody isMobile={isMobile}>
        <CloseBtn onClick={closeModal} />
        <AddPostForm
          onSuccess={closeModal}
          embeds={embedLink}
          selectedPlatforms={[SocialPlatform.Farcaster]}
        />
      </ModalBody>
    </ModalContainer>
  );
}

const ModalBody = styled.div<{ isMobile?: boolean }>`
  width: ${(props) => (props.isMobile ? 'fit-content' : '600px')};
  /* min-height: 194px; */
  flex-shrink: 0;

  padding: 20px;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;

  position: relative;
`;
const CloseBtn = styled(ModalCloseBtn)`
  position: absolute;
  top: 20px;
  right: 20px;
`;
