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
import { getBase64FromUrl } from '@/utils/shared/getBase64FromUrl';
import useCasterCollection from '@/hooks/poster/useCasterCollection';
import FirstMintButton from './FirstMintButton';
import ColorButton from '@/components/common/button/ColorButton';
import FreeMintButton from './FreeMintButton';
import SwitchNetworkButton from './SwitchNetworkButton';

interface Props extends ComponentPropsWithRef<'div'> {
  img: string;
  onFirstMintSuccess: (tokenId: number, walletAddress: string) => void;
}

export default function PosterMint({
  img,
  onFirstMintSuccess,
  className,
  ...props
}: Props) {
  const { chain } = useNetwork();
  const { address } = useAccount();
  const { isLogin, login } = useLogin();
  const [firstMinted, setFirstMinted] = useState(false);
  const [minted, setMinted] = useState(false);
  const [updatedMintersCount, setUpdatedMintersCount] = useState(0);
  const {
    isAdminOrRole,
    lastTokenFromToday,
    ownerMinted,
    lastTokenId,
    lastTokenInfo,
  } = useCasterCollection({
    owner: address,
  });
  const { totalMinted } = lastTokenInfo || { totalMinted: 0 };
  useEffect(() => {
    setFirstMinted(lastTokenFromToday);
  }, [lastTokenFromToday]);
  useEffect(() => {
    setMinted(ownerMinted);
  }, [ownerMinted]);

  useEffect(() => {
    setUpdatedMintersCount(firstMinted ? Number(totalMinted) : 0);
  }, [firstMinted, totalMinted]);

  const [imgBase64, setPosterImgBase64] = useState('');
  useEffect(() => {
    (async () => {
      const response = await getBase64FromUrl(img);
      setPosterImgBase64(response as string);
    })();
  }, [img]);

  return (
    <div className={cn('h-0 flex-1 flex-col', className)} {...props}>
      <MintInfo
        className="flex-1"
        data={{
          network: casterZoraNetwork.name,
          standard: 'ERC1155',
          contract: casterZora1155ToMintAddress,
          firstMinter: {
            avatar: '',
            displayName: '',
          },
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
          if (!firstMinted) {
            if (!isAdminOrRole) return null;
            return (
              <FirstMintButton
                className="w-full"
                img={imgBase64}
                onSuccess={(tokenId) => {
                  setFirstMinted(true);
                  setMinted(true);
                  onFirstMintSuccess?.(tokenId, address);
                }}
              />
            );
          }
          if (!minted) {
            return (
              <FreeMintButton
                className="w-full"
                tokenId={lastTokenId}
                onSuccess={() => {
                  setMinted(true);
                  setUpdatedMintersCount((pre) => pre + 1);
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
