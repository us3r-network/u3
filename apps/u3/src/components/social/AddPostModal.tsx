/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-11-24 18:31:36
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-12-06 14:03:41
 * @FilePath: /u3/apps/u3/src/components/social/AddPostModal.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useMemo } from 'react';
import { isMobile } from 'react-device-detect';
import styled from 'styled-components';
import { useFarcasterCtx } from '@/contexts/social/FarcasterCtx';
import ModalContainer from '../common/modal/ModalContainer';
import { ModalCloseBtn } from '../common/modal/ModalWidgets';
import AddPostForm from './AddPostForm';
import { cn } from '@/lib/utils';

export default function AddPostModal({
  open,
  defaultChannelId,
  closeModal,
}: {
  open: boolean;
  defaultChannelId?: string;
  closeModal: () => void;
}) {
  const { getChannelFromId } = useFarcasterCtx();
  const defaultChannel = useMemo(
    () => getChannelFromId(defaultChannelId),
    [defaultChannelId, getChannelFromId]
  );
  return (
    <ModalContainer
      open={open}
      closeModal={closeModal}
      zIndex={40}
      contentTop="30%"
    >
      <div
        className={cn(
          'w-[600px] flex-shrink-0 p-[20px] box-border flex flex-col justify-between gap-[20px] relative',
          'max-sm:w-[96vw]'
        )}
      >
        <ModalCloseBtn
          className="absolute top-[20px] right-[20px]"
          onClick={closeModal}
        />
        <AddPostForm onSuccess={closeModal} channel={defaultChannel} />
      </div>
    </ModalContainer>
  );
}
