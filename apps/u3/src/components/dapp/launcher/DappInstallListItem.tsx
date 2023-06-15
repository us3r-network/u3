import styled, { StyledComponentPropsWithRef } from 'styled-components';
import React from 'react';
import ImgDefault from '../../common/ImgDefault';
import { ReactComponent as DappHandleIcon } from '../../common/icons/svgs/dots-vertical.svg';

type Props = StyledComponentPropsWithRef<'div'> & {
  data: {
    image?: string;
    name?: string;
  };
  onOpen?: () => void;
  onOpenHandles?: () => void;
  disabled?: boolean;
};
export default React.forwardRef(function DappInstallListItem(
  { data, onOpen, onOpenHandles, disabled, ...props }: Props,
  ref
) {
  return (
    <Wrapper
      {...props}
      disabled={disabled}
      ref={ref as React.Ref<HTMLDivElement>}
    >
      <ItemInner>
        <ItemImg
          draggable={false}
          src={data?.image}
          onClick={() => !disabled && onOpen && onOpen()}
          title={data?.name}
        />
        <HandleIconBox
          draggable={false}
          className="handle-icon-box"
          onClick={(e) => {
            e.stopPropagation();
            if (!disabled && onOpenHandles) onOpenHandles();
          }}
        >
          <DappHandleIcon />
        </HandleIconBox>
      </ItemInner>
    </Wrapper>
  );
});
const Wrapper = styled.div<{ disabled?: boolean }>`
  width: 40px;
  box-sizing: border-box;
  ${({ disabled }) =>
    disabled &&
    `
    cursor: not-allowed;
    pointer-events: auto;
    opacity: 0.5;
  `}
`;
const ItemInner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #14171a;
  border-radius: 10px;
  transition: all 0.3s;
  &:hover {
    transform: scale(1.2);
  }
`;

const ItemImg = styled(ImgDefault)`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  flex-shrink: 0;
  cursor: pointer;
`;
const HandleIconBox = styled.span`
  width: 100%;
  height: 16px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  cursor: pointer;
  &:hover {
    transform: scale(1.2);
  }
`;
