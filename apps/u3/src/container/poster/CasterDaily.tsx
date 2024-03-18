import { useState } from 'react';
import MintSuccessModalBody from '@/components/poster/mint/MintSuccessModalBody';
import { POSTER_IMG_URL } from '@/constants';
import PosterShare from '@/components/poster/PosterShare';
import PosterMint from '@/components/poster/mint/PosterMint';
import { MainWrapper } from '@/components/layout/Index';
import { cn } from '@/lib/utils';

const posterImg = POSTER_IMG_URL;
export default function CasterDaily() {
  const [showMinted, setShowMinted] = useState(false);
  const [mintedTokenId, setMintedTokenId] = useState(0);
  const [mintedWalletAddress, setMintedWalletAddress] = useState('');
  return (
    <MainWrapper className={cn('flex flex-row gap-[20px]', 'max-sm:flex-col')}>
      {showMinted ? (
        <MintSuccessModalBody
          img={posterImg}
          tokenId={mintedTokenId}
          referrerAddress={mintedWalletAddress}
          className="max-sm:w-full"
        />
      ) : (
        <>
          {' '}
          <img
            src={posterImg}
            alt=""
            className={cn('w-[560px] h-fit object-cover', 'max-sm:w-full')}
          />
          <div
            className={cn(
              'w-[310px] flex flex-col gap-[20px]',
              'max-sm:w-full'
            )}
          >
            <PosterShare posterImg={posterImg} />
            <div className="w-full h-[1px] bg-[#39424C]" />
            <PosterMint
              img={posterImg}
              onFirstMintSuccess={(tokenId, walletAddress) => {
                setShowMinted(true);
                setMintedTokenId(tokenId);
                setMintedWalletAddress(walletAddress);
              }}
              onFreeMintSuccess={(tokenId, walletAddress) => {
                setShowMinted(true);
                setMintedTokenId(tokenId);
                setMintedWalletAddress(walletAddress);
              }}
            />
          </div>
        </>
      )}
    </MainWrapper>
  );
}
