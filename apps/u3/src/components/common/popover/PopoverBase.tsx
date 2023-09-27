import { Popover, Dialog } from 'react-aria-components';
import type { PopoverProps } from 'react-aria-components';
import styled, { keyframes } from 'styled-components';

interface PopoverBaseProps extends Omit<PopoverProps, 'children'> {
  children: React.ReactNode;
}

export default function PopoverBase({ children, ...props }: PopoverBaseProps) {
  return (
    <PopoverStyled {...props}>
      <DialogStyled>{children}</DialogStyled>
    </PopoverStyled>
  );
}

const slide = keyframes`
  from {
    transform: var(--origin);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

export const PopoverStyled = styled(Popover)`
  width: fit-content;
  height: fit-content;
  &[data-placement='top'] {
    margin-bottom: 6px;
    --origin: translateY(8px);
  }

  &[data-placement='bottom'] {
    margin-top: 6px;
    --origin: translateY(-8px);
    & .react-aria-OverlayArrow svg {
      transform: rotate(180deg);
    }
  }

  &[data-placement='right'] {
    margin-left: 6px;
    --origin: translateX(-8px);
    & .react-aria-OverlayArrow svg {
      transform: rotate(90deg);
    }
  }

  &[data-placement='left'] {
    margin-right: 6px;
    --origin: translateX(8px);
    & .react-aria-OverlayArrow svg {
      transform: rotate(-90deg);
    }
  }

  &[data-entering] {
    animation: ${slide} 200ms;
  }

  &[data-exiting] {
    animation: ${slide} 200ms reverse ease-in;
  }
`;

export const DialogStyled = styled(Dialog)`
  outline: none;
`;
