/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-10-20 19:07:48
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-10-30 15:27:44
 * @FilePath: /u3/apps/u3/src/components/social/ImagePreview.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { SyntheticEvent } from 'react';
import styled from 'styled-components';
import type { ImagesPreview } from '../../utils/social/file';
import { ModalCloseBtn } from '../common/modal/ModalWidgets';

type ImagePreviewProps = {
  imagesPreview: ImagesPreview;
  removeImage?: (targetId: string) => () => void;
};

function preventBubbling(
  callback?: ((...args: never[]) => unknown) | null,
  noPreventDefault?: boolean
) {
  return (e: SyntheticEvent): void => {
    e.stopPropagation();

    if (!noPreventDefault) e.preventDefault();
    if (callback) callback();
  };
}

export function ImagePreview({
  imagesPreview,
  removeImage,
}: ImagePreviewProps): JSX.Element {
  return (
    <Wrapper>
      {imagesPreview.map(({ id, src, alt }) => (
        <ImageContainer key={id}>
          <Image src={src} alt={alt} />
          {removeImage && (
            <CloseBtn onClick={preventBubbling(removeImage(id))} />
          )}
        </ImageContainer>
      ))}
    </Wrapper>
  );
}
const Wrapper = styled.div`
  width: 100%;
  flex-shrink: 0;
  box-sizing: border-box;
  display: flex;
  gap: 10px;
`;

const ImageContainer = styled.div`
  position: relative;
`;
const Image = styled.img`
  max-width: 100%;
  max-height: 250px;
  border-radius: 10px;
`;
const CloseBtn = styled(ModalCloseBtn)`
  position: absolute;
  top: 10px;
  left: 10px;
`;
