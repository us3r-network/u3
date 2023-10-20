import { Tooltip } from 'react-aria-components';
import type { TooltipProps } from 'react-aria-components';
import styled, { keyframes } from 'styled-components';

interface TooltipBaseProps extends Omit<TooltipProps, 'children'> {
  children: React.ReactNode;
}

export default function TooltipBase({ children, ...props }: TooltipBaseProps) {
  return <TooltipStyled {...props}>{children}</TooltipStyled>;
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

export const TooltipStyled = styled(Tooltip)`
  width: fit-content;
  height: fit-content;
  &[data-placement='top'] {
    margin-bottom: 8px;
    --origin: translateY(4px);
  }

  &[data-placement='bottom'] {
    margin-top: 8px;
    --origin: translateY(-4px);
    & .react-aria-OverlayArrow svg {
      transform: rotate(180deg);
    }
  }

  &[data-placement='right'] {
    margin-left: 8px;
    --origin: translateX(-4px);
    & .react-aria-OverlayArrow svg {
      transform: rotate(90deg);
    }
  }

  &[data-placement='left'] {
    margin-right: 8px;
    --origin: translateX(4px);
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
