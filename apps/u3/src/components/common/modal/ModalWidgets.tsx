import styled from 'styled-components';
import { ComponentPropsWithRef } from 'react';
import { ReactComponent as Close } from '../assets/svgs/close.svg';
import { cn } from '@/lib/utils';

export function ModalCloseBtn({
  className,
  ...props
}: ComponentPropsWithRef<'div'>) {
  return (
    <div
      className={cn(
        'w-[24px] h-[24px] rounded-[50%] flex-shrink-0 flex justify-center items-center bg-[#14171a] cursor-pointer',
        className
      )}
      {...props}
    >
      <Close className="w-[18px] h-[18px]" />
    </div>
  );
}

export const ModalTitle = styled.h3`
  color: #fff;
  font-family: Baloo Bhai 2;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

export const ModalDescription = styled.p`
  color: #fff;
  font-family: Baloo Bhai 2;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin: 0;
`;
