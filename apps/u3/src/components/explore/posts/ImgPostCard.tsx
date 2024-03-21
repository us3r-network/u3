import styled from 'styled-components';

import { isMobile } from 'react-device-detect';
import { ComponentPropsWithRef } from 'react';
import CardBase from '../../common/card/CardBase';
import { HeartIcon3 } from '../../common/icons/HeartIcon';
import { cn } from '@/lib/utils';

export type ImgPostCardData = {
  img: string;
  title?: string;
  likesCount: number;
  authorAvatar: string;
  authorDisplayName: string;
  authorHandle: string;
  recReason?: string;
  platformIconUrl?: string;
};
interface Props extends ComponentPropsWithRef<'div'> {
  idx: number;
  data: ImgPostCardData;
}
export default function ImgPostCard(props: Props) {
  const { idx } = props;
  if (isMobile || idx === 0) {
    return <FirstCard {...props} />;
  }
  if (idx === 1 || idx === 2) {
    return <RightCard {...props} />;
  }
  return <BottomCard {...props} />;
}

function FirstCard({ data, ...wrapperProps }: Props) {
  const {
    img,
    title,
    likesCount,
    authorAvatar,
    authorDisplayName,
    authorHandle,
    recReason = '#High Effort',
    platformIconUrl,
  } = data;
  return (
    <CardWrapper
      className="
        col-start-1
        col-end-4
        row-start-1
        row-end-3
      "
      {...wrapperProps}
    >
      <CardBody className="flex-col">
        {title && <Title className="line-clamp-2">{title}</Title>}
        <img
          className={cn(
            'w-full h-0 flex-[1] self-stretch rounded-[10px] object-cover',
            isMobile ? 'h-[160px] flex-none' : ''
          )}
          src={img}
          alt=""
        />

        <div
          className={cn(
            'flex justify-between items-center gap-[10px]',
            isMobile ? 'h-auto' : ''
          )}
        >
          <div className="flex flex-col gap-[10px]">
            <div className="flex items-center gap-[10px]">
              <div className="flex items-center gap-[10px]">
                <HeartIcon3 />
                <LikesCount>{likesCount}</LikesCount>
              </div>
              <span className="inline-block w-px h-[10px] bg-[#718096]" />
              <UserNameWrapper>
                <AuthorAvatar src={authorAvatar} />
                <AuthorDisplayName>
                  {authorDisplayName} {authorHandle && `@${authorHandle}`}
                </AuthorDisplayName>
              </UserNameWrapper>
            </div>
            <div className="flex items-center gap-[10px]">
              {platformIconUrl && <PlatformIcon src={platformIconUrl} />}
              <RecReason>{recReason}</RecReason>
            </div>
          </div>
        </div>
      </CardBody>
    </CardWrapper>
  );
}
function RightCard({ idx, data, ...wrapperProps }: Props) {
  const {
    img,
    title,
    likesCount,
    authorAvatar,
    authorDisplayName,
    authorHandle,
    recReason = '#High Effort',
    platformIconUrl,
  } = data;
  return (
    <CardWrapper
      className={cn(
        'col-start-4 col-end-7',
        idx === 1 ? 'row-start-1 row-end-2' : '',
        idx === 2 ? 'row-start-2 row-end-3' : ''
      )}
      {...wrapperProps}
    >
      <CardBody>
        <img
          className={cn(
            'flex-[1] h-full self-stretch rounded-[10px] object-cover'
          )}
          src={img}
          alt=""
        />

        <div
          className={cn(
            'overflow-hidden flex-[1] h-full flex flex-col gap-[10px]'
          )}
        >
          {title && <Title className="line-clamp-1">{title}</Title>}
          <div className="flex justify-between items-end gap-[10px] mt-auto">
            <div className="flex flex-col gap-[10px]">
              <div className="flex items-center gap-[10px]">
                <HeartIcon3 />
                <LikesCount>{likesCount}</LikesCount>
              </div>
              <UserNameWrapper>
                <AuthorAvatar src={authorAvatar} />
                <AuthorDisplayName>
                  {authorDisplayName} {authorHandle && `@${authorHandle}`}
                </AuthorDisplayName>
              </UserNameWrapper>
              <div className="flex items-center gap-[10px]">
                {platformIconUrl && <PlatformIcon src={platformIconUrl} />}
                <RecReason>{recReason}</RecReason>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </CardWrapper>
  );
}
function BottomCard({ idx, data, ...wrapperProps }: Props) {
  const {
    img,
    title,
    likesCount,
    authorAvatar,
    authorDisplayName,
    authorHandle,
    recReason = '#High Effort',
    platformIconUrl,
  } = data;
  return (
    <CardWrapper
      className={cn(
        'row-start-3 row-end-4',
        idx === 3 ? 'col-start-1 col-end-3' : '',
        idx === 4 ? 'col-start-3 col-end-5' : '',
        idx === 5 ? 'col-start-5 col-end-7' : ''
      )}
      {...wrapperProps}
    >
      <CardBody>
        <img
          className={cn('w-[97px] h-full rounded-[10px] object-cover')}
          src={img}
          alt=""
        />

        <div
          className={cn(
            'overflow-hidden flex-[1] h-full flex flex-col gap-[10px]'
          )}
        >
          <Title className="line-clamp-1">{title}</Title>
          <div className="flex justify-between items-end gap-[10px] mt-auto">
            <div className="flex flex-col gap-[10px]">
              <div className="flex items-center gap-[10px]">
                <HeartIcon3 />
                <LikesCount>{likesCount}</LikesCount>
              </div>
              <UserNameWrapper>
                <AuthorAvatar src={authorAvatar} />
                <AuthorDisplayName>
                  {authorDisplayName} {authorHandle && `@${authorHandle}`}
                </AuthorDisplayName>
              </UserNameWrapper>
              <div className="flex items-center gap-[10px]">
                {platformIconUrl && <PlatformIcon src={platformIconUrl} />}
                <RecReason>{recReason}</RecReason>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </CardWrapper>
  );
}
const CardWrapper = styled(CardBase)`
  cursor: pointer;
  overflow: hidden;
  &:hover {
    & > * {
      transform: scale(1.05);
    }
  }
  ${isMobile &&
  `
    padding: 10px;
    border-radius: 10px;
  `}
`;

function CardBody({ className, ...props }: ComponentPropsWithRef<'div'>) {
  return (
    <div
      className={cn(
        'w-full h-full [transition:all_0.3s] flex gap-[20px] relative',
        'max-sm:flex-col max-sm:gap-[10px]',
        className || ''
      )}
      {...props}
    />
  );
}

function Title({ className, ...props }: ComponentPropsWithRef<'span'>) {
  return (
    <span
      className={cn(
        'font-bold text-[18px] leading-[19px] text-[#ffffff]',
        'max-sm:text-[16px] max-sm:leading-[19px] max-sm:font-medium',
        className || ''
      )}
      {...props}
    />
  );
}

function UserNameWrapper({
  className,
  ...props
}: ComponentPropsWithRef<'div'>) {
  return (
    <div
      className={cn('flex items-center gap-[10px]', className || '')}
      {...props}
    />
  );
}

function LikesCount({ className, ...props }: ComponentPropsWithRef<'span'>) {
  return (
    <span
      className={cn(
        'text-[#ffffff] text-center text-[14px] font-normal leading-[normal]',
        className || ''
      )}
      {...props}
    />
  );
}

function AuthorAvatar({ className, ...props }: ComponentPropsWithRef<'img'>) {
  return (
    <img
      className={cn(
        'w-[14px] h-[14px] rounded-[50%] object-cover flex-shrink-0',
        className || ''
      )}
      alt=""
      {...props}
    />
  );
}

function AuthorDisplayName({
  className,
  ...props
}: ComponentPropsWithRef<'span'>) {
  return (
    <span
      className={cn(
        'line-clamp-1 text-[#718096] text-[12px] font-normal leading-[normal]',
        className || ''
      )}
      {...props}
    />
  );
}

const RecReason = styled.div`
  /* Regular-14 */
  font-size: 14px;
  font-weight: 400;
  line-height: normal;
  background: linear-gradient(52deg, #cd62ff 35.31%, #62aaff 89.64%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

function PlatformIcon({ className, ...props }: ComponentPropsWithRef<'img'>) {
  return (
    <img
      className={cn(
        'w-[14px] h-[14px] rounded-[50%]  object-cover flex-shrink-0',
        className || ''
      )}
      alt=""
      {...props}
    />
  );
}
