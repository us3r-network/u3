/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { ComponentPropsWithoutRef, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Token } from '@zoralabs/zdk/dist/queries/queries-sdk';
import { useAccount, useNetwork } from 'wagmi';
import ColorButton from '@/components/common/button/ColorButton';
import { cn } from '@/lib/utils';
import useCasterTokenInfoWithTokenId, {
  SaleStatus,
} from '@/hooks/poster/useCasterTokenInfoWithTokenId';
import useCasterOwnerInfoWithTokenId from '@/hooks/poster/useCasterOwnerInfoWithTokenId';
import useLogin from '@/hooks/shared/useLogin';
import { casterZoraChainId } from '@/constants/zora';
import SwitchNetworkButton from '../mint/SwitchNetworkButton';
import FreeMintButton from '../mint/FreeMintButton';
import { Button } from '@/components/ui/button';
import PosterPreviewModal from './PosterPreviewModal';

interface GalleryItemProps extends ComponentPropsWithoutRef<'div'> {
  data: Token;
}

export default function GalleryItem({
  data,
  className,
  ...props
}: GalleryItemProps) {
  const { image, lastRefreshTime, metadata, tokenId } = data;
  const imageOriginUrl = metadata?.properties?.imageOriginUrl;
  const createAt = metadata?.properties?.createAt;
  const posterDataJson = metadata?.properties?.posterDataJson;
  const posterData = JSON.parse(posterDataJson || '{}');

  const { isLogin, login } = useLogin();
  const { chain } = useNetwork();
  const { address } = useAccount();
  const { totalMinted, saleStatus, saleStart } = useCasterTokenInfoWithTokenId({
    tokenId: Number(tokenId),
  });
  const { isMinted } = useCasterOwnerInfoWithTokenId({
    tokenId: Number(tokenId),
    ownerAddress: address,
  });

  const posterCreateTimestamp = dayjs(
    Number(createAt) * 1000 || Number(saleStart) * 1000 || lastRefreshTime
  ).valueOf();

  const [minted, setMinted] = useState(true);
  const [updatedMintersCount, setUpdatedMintersCount] = useState(0);
  useEffect(() => {
    setMinted(isMinted);
  }, [isMinted]);

  useEffect(() => {
    setUpdatedMintersCount(Number(totalMinted));
  }, [totalMinted]);

  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  return (
    <div className={cn('', className)} {...props}>
      <PosterPreviewModal
        createAt={posterCreateTimestamp}
        posterImg={imageOriginUrl || image.mediaEncoding.original}
        posterData={posterData}
        open={openPreviewModal}
        closeModal={() => setOpenPreviewModal(false)}
      />
      <img
        className="w-full h-[300px] object-cover cursor-pointer"
        src={imageOriginUrl}
        alt=""
        onClick={() => setOpenPreviewModal(true)}
        onError={(el) => {
          const target = el.target as HTMLImageElement;
          const errImg = image.mediaEncoding.original;
          if (errImg && target.src !== errImg) {
            target.src = errImg;
          }
        }}
      />
      <div className="mt-[10px] flex justify-between items-center">
        <span className="text-white text-[16px] italic font-bold leading-[normal]">
          {dayjs(posterCreateTimestamp).format('MMMM DD, YYYY')}
        </span>
        <span className="text-[#718096] font-[Roboto] text-[12px] not-italic font-medium leading-[normal]">
          {(() => {
            switch (saleStatus) {
              case SaleStatus.NotStarted:
                return 'Not Started';
              case SaleStatus.InProgress:
                if (updatedMintersCount === 0) {
                  return 'In Progress...';
                }
                return `Minted ${updatedMintersCount} times`;
              case SaleStatus.Ended:
                if (updatedMintersCount === 0) {
                  return 'Ended';
                }
                return `Minted ${updatedMintersCount} times`;
              default:
                return '';
            }
          })()}
        </span>
      </div>
      <div className="mt-[10px] flex justify-between items-center">
        {(() => {
          if (minted) {
            return (
              <Button
                className="flex-1 h-[48px] p-[12px] gap-[8px] rounded-[12px] text-white text-[16px] font-bold bg-[#A3B0C3]"
                disabled
              >
                Minted
              </Button>
            );
          }
          if (!isLogin) {
            return (
              <ColorButton className="flex-1" onClick={login}>
                Free Mint
              </ColorButton>
            );
          }
          if (chain?.id !== Number(casterZoraChainId)) {
            return <SwitchNetworkButton className="flex-1" />;
          }
          return (
            <FreeMintButton
              className="flex-1"
              tokenId={Number(tokenId)}
              onSuccess={() => {
                setMinted(true);
                setUpdatedMintersCount((pre) => pre + 1);
              }}
            />
          );
        })()}
      </div>
    </div>
  );
}