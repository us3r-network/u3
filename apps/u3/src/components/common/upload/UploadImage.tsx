import { toast } from 'react-toastify';
import { useState } from 'react';
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { UPLOAD_IMAGE_SIZE_LIMIT } from '../../../constants';
import { uploadImage } from '../../../services/shared/api/upload';
import { messages } from '../../../utils/shared/message';
import UploadImgMaskImg from '../assets/imgs/upload_img_mask.svg';
import CardBase from '../card/CardBase';
import useLogin from '../../../hooks/shared/useLogin';
import { ReactComponent as CloseSvg } from '../assets/svgs/close.svg';

type Props = StyledComponentPropsWithRef<'div'> & {
  url: string;
  onSuccess: (url: string) => void;
  showDelete?: boolean;
  onDelete?: () => void;
};
export default function UploadImage({
  url,
  onSuccess,
  showDelete,
  onDelete,
  ...otherProps
}: Props) {
  const [loading, setLoading] = useState(false);
  const { user } = useLogin();
  return (
    <UploadImageWrapper
      onClick={(e) => {
        e.stopPropagation();
        if (loading) return;
        const input = e.currentTarget.querySelector('input');
        input?.click();
      }}
      {...otherProps}
    >
      <UploadImageInner>
        <input
          title="uploadInput"
          style={{ display: 'none' }}
          type="file"
          accept="image/png, image/gif, image/jpeg"
          onChange={(e) => {
            const file = e.target.files && e.target.files[0];
            if (!file) return;
            if (file.size > UPLOAD_IMAGE_SIZE_LIMIT) {
              toast.error(messages.common.upload_img_limit);
              return;
            }
            setLoading(true);
            uploadImage(file, user?.token)
              .then((result) => {
                onSuccess(result.data.url);
                toast.success(messages.common.upload_img);
              })
              .catch((error) =>
                toast.error(error.message || messages.common.error)
              )
              .finally(() => setLoading(false));
          }}
        />

        {(loading && <div className="uploading">Uploading ...</div>) ||
          (url && <UploadImagePreview src={url} />)}
      </UploadImageInner>
      {showDelete && (
        <DeleteBtn
          className="delete-btn"
          onClick={(e) => {
            e.stopPropagation();
            if (onDelete) {
              onDelete();
            }
          }}
        >
          <CloseSvg />
        </DeleteBtn>
      )}
    </UploadImageWrapper>
  );
}

const UploadImageWrapper = styled.div`
  width: 160px;
  height: 160px;
  position: relative;
`;

const UploadImageInner = styled(CardBase)`
  width: 160px;
  height: 160px;
  padding: 0;
  position: relative;
  &:hover {
    cursor: pointer;
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url(${UploadImgMaskImg});
    }
  }
  & .uploading {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #4e5a6e;
  }
`;
const UploadImagePreview = styled.img`
  width: 160px;
  height: 160px;
  object-fit: cover;
`;

const DeleteBtn = styled.div`
  position: absolute;
  top: -5px;
  right: -5px;
  width: 20px;
  height: 20px;
  background-color: red;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &:hover {
    transform: scale(1.2);
    transition: all 0.3s;
  }
`;
