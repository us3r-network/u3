import { ComponentPropsWithRef, useEffect, useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import MintInfo from './MintInfo';
import { cn } from '@/lib/utils';
import useLogin from '@/hooks/shared/useLogin';
import {
  casterZora1155ToMintAddress,
  casterZoraChainId,
  casterZoraNetwork,
} from '@/constants/zora';
import ColorButton from '@/components/common/button/ColorButton';
import FreeMintButton from './FreeMintButton';
import SwitchNetworkButton from './SwitchNetworkButton';
import useCasterLastTokenInfo from '@/hooks/poster/useCasterLastTokenInfo';
import useCasterOwnerInfoWithTokenId from '@/hooks/poster/useCasterOwnerInfoWithTokenId';

interface Props extends ComponentPropsWithRef<'div'> {
  img: string;
  onFirstMintSuccess: (tokenId: number, walletAddress: string) => void;
  onFreeMintSuccess: (tokenId: number, walletAddress: string) => void;
}

export default function PosterMint({
  img,
  onFirstMintSuccess,
  onFreeMintSuccess,
  className,
  ...props
}: Props) {
  const { chain } = useNetwork();
  const { address } = useAccount();
  const { isLogin, login } = useLogin();
  const [minted, setMinted] = useState(true);
  const [updatedMintersCount, setUpdatedMintersCount] = useState(0);
  const { lastTokenId, totalMinted, mintInfo } = useCasterLastTokenInfo();
  const isFirstMint = totalMinted === 0 && !mintInfo?.originatorAddress;

  const { isMinted } = useCasterOwnerInfoWithTokenId({
    ownerAddress: address,
    tokenId: lastTokenId,
  });

  useEffect(() => {
    setMinted(isMinted);
  }, [isMinted]);

  useEffect(() => {
    setUpdatedMintersCount(Number(totalMinted));
  }, [totalMinted]);

  return (
    <div className={cn('h-0 flex-1 flex-col', className)} {...props}>
      <MintInfo
        className="flex-1"
        data={{
          network: casterZoraNetwork.name,
          standard: 'ERC1155',
          contract: casterZora1155ToMintAddress,
          firstMinter: mintInfo?.originatorAddress || '',
          mintersCount: updatedMintersCount,
        }}
      />
      <div className="mt-[20px]">
        {(() => {
          if (!isLogin) {
            return (
              <ColorButton className="w-full" onClick={login}>
                Mint After Logging In
              </ColorButton>
            );
          }
          if (chain?.id !== Number(casterZoraChainId)) {
            return <SwitchNetworkButton className="w-full" />;
          }
          if (!minted) {
            return (
              <FreeMintButton
                isFirstMint={isFirstMint}
                className="w-full"
                tokenId={lastTokenId}
                onSuccess={() => {
                  setMinted(true);
                  setUpdatedMintersCount((pre) => pre + 1);
                  onFreeMintSuccess?.(lastTokenId, address);
                }}
              />
            );
          }
          return null;
        })()}
      </div>
    </div>
  );
}
