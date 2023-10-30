import styled, { StyledComponentPropsWithRef } from 'styled-components';
import CardBase from '../card/CardBase';
import UploadImage from './UploadImage';
import { ReactComponent as PlusSvg } from '../assets/svgs/plus.svg';
import InputBase from '../input/InputBase';

type Props = StyledComponentPropsWithRef<'div'> & {
  urls: string[];
  onSuccess: (urls: string[]) => void;
  showInput?: boolean;
};
export default function UploadImages({
  urls,
  onSuccess,
  showInput,
  ...otherProps
}: Props) {
  return (
    <Wrapper {...otherProps}>
      {urls.map((url, index) => (
        <ImageWrapper>
          <UploadImage
            showDelete
            url={url}
            onSuccess={(u) => {
              urls[index] = u;
              onSuccess(urls);
            }}
            onDelete={() => {
              urls.splice(index, 1);
              onSuccess(urls);
            }}
          />
          {showInput && (
            <ImageUrlInput
              placeholder="Image url"
              onChange={(e) => {
                urls[index] = e.target.value;
                onSuccess(urls);
              }}
              value={url}
            />
          )}
        </ImageWrapper>
      ))}
      <AddBtn
        onClick={() => {
          urls.push('');
          onSuccess(urls);
        }}
      >
        <PlusSvg />
      </AddBtn>
    </Wrapper>
  );
}

const Wrapper = styled(CardBase)`
  display: flex;
  align-items: center;
  gap: 20px;
  // 允许换行
  flex-wrap: wrap;
`;

const ImageWrapper = styled.div`
  width: 160px;
`;
const ImageUrlInput = styled(InputBase)`
  margin-top: 10px;
`;

const AddBtn = styled(CardBase)`
  width: 160px;
  height: 160px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border: 1px dashed #4e5a6e;
  svg {
    width: 50px;
    height: 50px;
    path {
      stroke: #4e5a6e;
    }
  }
  &:hover {
    border-color: #e5e5e5;
    svg {
      path {
        stroke: #e5e5e5;
      }
    }
  }
`;
