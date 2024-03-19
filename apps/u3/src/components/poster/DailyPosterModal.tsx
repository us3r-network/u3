import { useEffect, useState } from 'react';
import DailyPosterLayout, {
  DailyPosterLayoutProps,
} from './layout/DailyPosterLayout';
import ModalBase from '../common/modal/ModalBase';
import { POSTER_IMG_URL } from '@/constants';
import { ModalCloseBtn } from '@/components/common/modal/ModalWidgets';
import PosterShare from './PosterShare';
import PosterMint from './mint/PosterMint';
import MintSuccessModalBody from './mint/MintSuccessModalBody';

type Props = DailyPosterLayoutProps & {
  open: boolean;
  closeModal: () => void;
};
const posterImg = POSTER_IMG_URL;
export default function DailyPosterModal({
  posts,
  farcasterUserData,
  topics,
  dapps,
  links,
  open,
  closeModal,
}: Props) {
  const [showMinted, setShowMinted] = useState(false);
  const [mintedTokenId, setMintedTokenId] = useState(0);
  const [mintedWalletAddress, setMintedWalletAddress] = useState('');
  useEffect(() => {
    // 后端生成poster图片时，会同时读取posterDataJson，用于创建caster nft时设置metadata
    (window as any).posterDataJson = JSON.stringify({
      uiVersion: 1, // poster布局版本号，如果后续poster布局有变化，考虑更新这个版本号，使用相应的布局组件
      posts,
      farcasterUserData,
      topics,
      dapps,
      links,
    });
  }, [posts, farcasterUserData, topics, dapps, links]);
  return (
    <ModalBase
      isOpen={open}
      style={{
        content: {
          inset: '115px',
        },
        overlay: {
          zIndex: 30,
        },
      }}
    >
      <div
        className="
          flex-shrink-0
          p-[20px]
          box-border
          flex
          gap-[20px]
          bg-[#1b1e23]
        "
      >
        {showMinted ? (
          <MintSuccessModalBody
            img={posterImg}
            tokenId={mintedTokenId}
            referrerAddress={mintedWalletAddress}
            closeModal={closeModal}
          />
        ) : (
          <>
            {' '}
            <img src={posterImg} alt="" className="w-[560px] object-cover" />
            <DailyPosterLayout
              id="posterLayout"
              posts={posts}
              farcasterUserData={farcasterUserData}
              topics={topics}
              dapps={dapps}
              links={links}
              className="fixed right-full"
            />
            <div className="w-[310px] flex flex-col gap-[20px]">
              <div className="flex justify-between items-center">
                <h1 className="text-[#FFF] text-[40px] font-bold leading-none">
                  U3 Caster
                </h1>
                <ModalCloseBtn onClick={closeModal} />
              </div>
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
      </div>
    </ModalBase>
  );
}
